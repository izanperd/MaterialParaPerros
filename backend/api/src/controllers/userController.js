
const userService = require("../services/userService");

// Registrar un usuario.
const register = async (req, res, next) => {
    try {
        const user = await userService.register(req.body);

        res.status(201).json({
            success: true,
            message: "Usuario registrado correctamente",
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// Iniciar sesión.
const login = async (req, res, next) => {
    try {
        const result = await userService.login(req.body);

        res.status(200).json({
            success: true,
            message: "Inicio de sesión correcto",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// Mostrar todos los usuarios.
const getUsers = async (req, res, next) => {
    try {
        const result = await userService.getUsers(req.query);

        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        next(error);
    }
};

// Mostrar un usuario por su ID.
const getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);

        if (!user) {
            const error = new Error("Usuario no encontrado");
            error.status = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// Modificar un usuario.
const updateUser = async (req, res, next) => {
    try {
        const user = await userService.updateUser(
            req.params.id,
            req.body
        );

        if (!user) {
            const error = new Error("Usuario no encontrado");
            error.status = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// Desactivar un usuario.
const deleteUser = async (req, res, next) => {
    try {
        const user = await userService.deleteUser(req.params.id);

        if (!user) {
            const error = new Error("Usuario no encontrado");
            error.status = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: "Usuario desactivado"
        });
    } catch (error) {
        next(error);
    }
};

// Exportamos todas las funciones.
module.exports = {
    register,
    login,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};
