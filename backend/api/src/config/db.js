
const mongoose = require("mongoose");

// Esta función conecta nuestra API con MongoDB.
const connectDB = async () => {
    try {
        // Comprobamos que exista la dirección de MongoDB.
        if (!process.env.MONGO_URI) {
            throw new Error("Falta MONGO_URI en el archivo .env");
        }

        // Nos conectamos a MongoDB.
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });

        // Mostramos dónde estamos conectados.
        console.log("MongoDB conectado correctamente");
        console.log("Base de datos:", mongoose.connection.name);
        console.log("Servidor:", mongoose.connection.host);

    } catch (error) {
        // Si falla la conexión, mostramos el motivo.
        console.error("Error al conectar con MongoDB:");
        console.error(error.message);

        throw error;
    }
};

// Exportamos la función para utilizarla en index.js.
module.exports = connectDB;
