
// Cargamos las variables del archivo .env.
require("dotenv").config();

const express = require("express");

// Importamos la conexión con MongoDB.
const connectDB = require("./config/db");

// Importamos las rutas.
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/userRoutes");

// Importamos el gestor de errores.
const errorHandler = require("./middleware/errorHandler");

// Creamos la aplicación.
const app = express();

// Permitimos recibir datos JSON.
app.use(express.json());

// Ruta principal para comprobar que la API funciona.
app.get("/", (req, res) => {
    res.send("API MaterialParaPerros en marcha");
});

// Conectamos las rutas de productos.
app.use("/api/products", productRoutes);

// Conectamos las rutas de categorías.
app.use("/api/categories", categoryRoutes);

// Conectamos las rutas de usuarios.
app.use("/api/users", userRoutes);

// Si una dirección no existe, mostramos un error 404.
app.use((req, res, next) => {
    const error = new Error("Ruta no encontrada");
    error.status = 404;
    next(error);
});

// Este middleware recoge los errores de toda la API.
// Tiene que estar al final de las rutas.
app.use(errorHandler);

// Utilizamos el puerto del archivo .env.
const PORT = process.env.PORT || 3003;

// Primero conectamos MongoDB y después arrancamos el servidor.
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });

    } catch (error) {
        console.error("No se ha podido iniciar la API");
        process.exit(1);
    }
};

// Arrancamos la aplicación.
startServer();
