const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
      trim: true
    },

    descripcion: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true
    },

    precio: {
      type: Number,
      required: true,
      min: 0
    },

    stock: {
      type: Number,
      required: true,
      min: 0
    },

    categoriaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    }
  },
  {
    timestamps: true
  }
);

productSchema.index({ categoriaId: 1 });
productSchema.index({ nombre: 1 });

module.exports = mongoose.model('Product', productSchema);