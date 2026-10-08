const mongoose = require('mongoose');

const dogSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      trim: true
    },

    edad: {
      type: Number,
      required: true,
      min: 0,
      max: 20
    },

    raza: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true
    },

    peso: {
      type: Number,
      required: true,
      min: 1,
      max: 100
    },

    especialidad: {
      type: String,
      required: true,
      enum: [
        'rescate',
        'deteccion',
        'busqueda',
        'seguridad',
        'adiestramiento'
      ]
    },

    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

dogSchema.index({ usuarioId: 1 });

module.exports = mongoose.model('Dog', dogSchema);