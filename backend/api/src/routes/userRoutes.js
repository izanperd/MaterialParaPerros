
const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Registrar un usuario.
router.post("/registro", userController.register);

// Iniciar sesión.
router.post("/login", userController.login);

// Renovar los tokens.
router.post("/refresh", userController.refresh);

// Cerrar sesión.
router.post("/logout", userController.logout);

// Consultar el perfil.
// Esta ruta necesita un access token válido.
router.get("/me", authMiddleware, userController.getMe);

// Evitar que GET /registro se interprete como un ID.
router.get("/registro", (req, res) => {
    res.status(405).json({
        success: false,
        message: "Para registrar un usuario utiliza POST"
    });
});

// Mostrar todos los usuarios.
router.get("/", userController.getUsers);

// Buscar un usuario por su ID.
router.get("/:id", userController.getUserById);

// Modificar un usuario.
router.put("/:id", userController.updateUser);

// Desactivar un usuario.
router.delete("/:id", userController.deleteUser);

// Exportar las rutas.
module.exports = router;
