const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    productoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },

    fecha: {
      type: Date,
      default: Date.now
    },

    cantidad: {
      type: Number,
      required: true,
      min: 1
    },

    total: {
      type: Number,
      required: true,
      min: 0
    }

  },
  {
    timestamps: true
  }
);

orderSchema.index({ usuarioId: 1 });
orderSchema.index({ productoId: 1 });
orderSchema.index({ estado: 1 });

module.exports = mongoose.model('Order', orderSchema);