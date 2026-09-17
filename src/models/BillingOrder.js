const mongoose = require('mongoose');

const { Schema } = mongoose;

// Records an upgrade attempt/order. Payment gateway integration (Razorpay/Stripe)
// can plug into `providerOrderId` / `providerPaymentId` without changing the shape.
const billingOrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    planId: { type: String, required: true },
    amountInr: { type: Number, required: true },
    status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
    providerOrderId: { type: String },
    providerPaymentId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BillingOrder', billingOrderSchema);
