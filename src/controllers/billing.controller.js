const crypto = require('crypto');
const BillingOrder = require('../models/BillingOrder');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/ApiResponse');
const { PLANS } = require('../data/catalog');

function findPlan(planId) {
  return PLANS.find((p) => p.id === planId);
}

async function listPlans(req, res) {
  return sendSuccess(res, 200, PLANS);
}

async function getCurrentPlan(req, res) {
  const plan = findPlan(req.user.subscription.planId) || findPlan('free');
  return sendSuccess(res, 200, { ...req.user.subscription.toObject(), plan });
}

async function createUpgradeOrder(req, res) {
  const { planId } = req.body;
  const plan = findPlan(planId);
  if (!plan) throw ApiError.badRequest('Unknown plan');
  if (plan.id === 'free') throw ApiError.badRequest('Cannot create an order for the free plan');

  const order = await BillingOrder.create({
    user: req.user._id,
    planId: plan.id,
    amountInr: plan.priceInr,
    status: 'created',
    providerOrderId: `order_${crypto.randomBytes(8).toString('hex')}`,
  });

  return sendSuccess(
    res,
    201,
    { orderId: order._id, providerOrderId: order.providerOrderId, amountInr: order.amountInr, planId: order.planId },
    'Upgrade order created'
  );
}

// Placeholder for a payment gateway webhook/confirmation call. In production this
// would verify a signature from the provider (e.g. Razorpay/Stripe) before marking
// the order paid and activating the subscription.
async function confirmUpgrade(req, res) {
  const { orderId, providerPaymentId } = req.body;

  const order = await BillingOrder.findOne({ _id: orderId, user: req.user._id });
  if (!order) throw ApiError.notFound('Order not found');
  if (order.status === 'paid') throw ApiError.conflict('Order already confirmed');

  order.status = 'paid';
  order.providerPaymentId = providerPaymentId || `pay_${crypto.randomBytes(8).toString('hex')}`;
  await order.save();

  const plan = findPlan(order.planId);
  const renewsAt = new Date();
  if (plan.interval === 'year') renewsAt.setFullYear(renewsAt.getFullYear() + 1);
  else renewsAt.setMonth(renewsAt.getMonth() + 1);

  req.user.subscription.planId = plan.id;
  req.user.subscription.status = 'active';
  req.user.subscription.renewsAt = renewsAt;
  await req.user.save();

  return sendSuccess(res, 200, req.user.subscription, 'Subscription upgraded');
}

async function cancelSubscription(req, res) {
  req.user.subscription.planId = 'free';
  req.user.subscription.status = 'canceled';
  req.user.subscription.renewsAt = null;
  await req.user.save();
  return sendSuccess(res, 200, req.user.subscription, 'Subscription canceled, moved to Free plan');
}

module.exports = { listPlans, getCurrentPlan, createUpgradeOrder, confirmUpgrade, cancelSubscription };
