const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
      minlength: 2,
      maxlength: 50,
      trim: true
    },

    descripcion: {
      type: String,
      maxlength: 200,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

categorySchema.index({ nombre: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);