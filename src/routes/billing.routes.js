const router = require('express').Router();
const { z } = require('zod');
const billingController = require('../controllers/billing.controller');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');

const createOrderSchema = z.object({ planId: z.enum(['pro_monthly', 'pro_annual']) });
const confirmOrderSchema = z.object({ orderId: z.string().min(1), providerPaymentId: z.string().optional() });

router.get('/plans', billingController.listPlans);

router.use(requireAuth);
router.get('/current', billingController.getCurrentPlan);
router.post('/upgrade', validate(createOrderSchema), billingController.createUpgradeOrder);
router.post('/confirm', validate(confirmOrderSchema), billingController.confirmUpgrade);
router.post('/cancel', billingController.cancelSubscription);

module.exports = router;
