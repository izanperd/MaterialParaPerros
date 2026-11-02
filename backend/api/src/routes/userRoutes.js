
const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

// Registrar un usuario.
router.post("/registro", userController.register);

// Iniciar sesión.
router.post("/login", userController.login);

// Evitar que GET /registro se interprete como un ID.
router.get("/registro", (req, res) => {
    res.status(405).json({
        success: false,
        message: "Para registrar un usuario debes utilizar POST"
    });
});

// Evitar que GET /login se interprete como un ID.
router.get("/login", (req, res) => {
    res.status(405).json({
        success: false,
        message: "Para iniciar sesión debes utilizar POST"
    });
});

// Consultar todos los usuarios.
router.get("/", userController.getUsers);

// Consultar un usuario por su ID.
router.get("/:id", userController.getUserById);

// Modificar un usuario.
router.put("/:id", userController.updateUser);

// Desactivar un usuario.
router.delete("/:id", userController.deleteUser);

// Exportamos las rutas.
module.exports = router;
