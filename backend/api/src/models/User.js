
const mongoose = require("mongoose");

// Aquí definimos los datos que puede tener cada usuario.
const userSchema = new mongoose.Schema(
    {
        // Nombre del usuario.
        name: {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        },

        // Correo obligatorio y único para cada usuario.
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },

        // Guardamos el hash, nunca la contraseña original.
        passwordHash: {
            type: String,
            required: true,
            select: false
        },

        // Los usuarios nuevos serán clientes, no administradores.
        role: {
            type: String,
            enum: ["client", "admin"],
            default: "client"
        },

        // Permite desactivar usuarios sin borrarlos de la base de datos.
        active: {
            type: Boolean,
            default: true
        }
    },
    {
        // Guardamos automáticamente las fechas de creación y modificación.
        timestamps: true
    }
);

// Quitamos el hash antes de convertir un usuario a JSON para responder.
userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        delete returnedObject.passwordHash;
        delete returnedObject.__v;
        return returnedObject;
    }
});

module.exports = mongoose.model("User", userSchema);
