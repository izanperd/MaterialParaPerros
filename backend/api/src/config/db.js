
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Conectamos con MongoDB usando la dirección del archivo .env.
    await mongoose.connect(process.env.MONGO_URI);

    // Avisamos cuando la conexión funciona.
    console.log('MongoDB conectado correctamente');
  } catch (error) {
    // Mostramos el error si no podemos conectar.
    console.error('Error al conectar con MongoDB:', error.message);
    throw error;
  }
};

module.exports = connectDB;