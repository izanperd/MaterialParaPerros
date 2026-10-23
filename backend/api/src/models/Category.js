
const mongoose = require("mongoose");

// Aquí explicamos qué datos tendrá cada categoría.
const categorySchema = new mongoose.Schema(
    {
        // Nombre de la categoría. No puede estar vacío y debe tener 3 letras como mínimo.
        name: {
            type: String,
            required: true,
            minlength: 3,
            trim: true
        },

        // Dirección corta que identifica la categoría y no se puede repetir.
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        // Explicación opcional de la categoría. Como máximo, 500 caracteres.
        description: {
            type: String,
            maxlength: 500,
            default: ""
        },

        // Indica si la categoría está activa. Si no decimos nada, será true.
        active: {
            type: Boolean,
            default: true
        }
    },
    {
        // MongoDB guardará automáticamente la fecha de creación y modificación.
        timestamps: true
    }
);

// Creamos el modelo que usaremos para trabajar con las categorías.
module.exports = mongoose.model("Category", categorySchema);
