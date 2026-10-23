
require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Permite recibir datos en formato JSON
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
  res.send('API MaterialParaPerros en marxa 🐕');
});

// Rutas de productos
app.use('/api/products', productRoutes);
// Rutas de categorías
app.use('/api/categories', categoryRoutes);
// Todas las rutas de usuarios empezarán por /api/users.
app.use("/api/users", userRoutes);

// Iniciar el servidor y conectar la base de datos
const PORT = process.env.PORT || 3003;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Servidor escoltant al port ${PORT}`);
    });
  } catch (error) {
    console.error('Error en iniciar l’API:', error.message);
    process.exit(1);
  }
};

startServer();
