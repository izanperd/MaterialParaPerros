
const mongoose = require("mongoose");

// Aquí definimos los datos de cada usuario.
const userSchema = new mongoose.Schema(
    {
        // Nombre del usuario.
        name: {
            type: String,
            required: true,
            minlength: 2,
            trim: true
        },

        // Email obligatorio y único.
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },

        // Aquí guardamos el hash de la contraseña.
        passwordHash: {
            type: String,
            required: true,
            select: false
        },

        // El usuario nuevo será cliente.
        role: {
            type: String,
            enum: ["client", "admin"],
            default: "client"
        },

        // Indica si el usuario está activo.
        active: {
            type: Boolean,
            default: true
        }
    },
    {
        // MongoDB guarda las fechas automáticamente.
        timestamps: true
    }
);

// Quitamos el hash de la respuesta JSON.
userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        delete returnedObject.passwordHash;
        delete returnedObject.__v;
        return returnedObject;
    }
});

// Creamos el modelo.
module.exports = mongoose.model("User", userSchema);
