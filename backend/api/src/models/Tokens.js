const mongoose = require("mongoose");

// Aquí guardamos los refresh tokens de los usuarios.
const tokenSchema = new mongoose.Schema(
    {
        // Usuario al que pertenece el token.
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Guardamos el hash del token, nunca el token original.
        tokenHash: {
            type: String,
            required: true,
            unique: true
        },

        // Identifica todos los tokens de una misma sesión.
        familyId: {
            type: String,
            required: true
        },

        // Fecha en la que caduca el token.
        expiresAt: {
            type: Date,
            required: true
        },

        // Si tiene fecha, significa que el token está invalidado.
        revokedAt: {
            type: Date,
            default: null
        },

        // Guarda el hash del siguiente token cuando se renueva.
        replacedByTokenHash: {
            type: String,
            default: null
        }
    },
    {
        // Guarda automáticamente las fechas de creación y modificación.
        timestamps: true
    }
);

// Creamos el modelo.
module.exports = mongoose.model("Tokens", tokenSchema);