const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    itemName: {
      type: String, // Cached name in case the item gets deleted/modified
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'Mobile Transfer'],
      default: 'Cash',
    },
    salespersonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Optional link to user auth model
    },
    transactionDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sale', saleSchema);