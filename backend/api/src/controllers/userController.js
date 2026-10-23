
const userService = require("../services/userService");

// Crear un usuario.
const createUser = async (req, res, next) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// Mostrar usuarios.
const getUsers = async (req, res, next) => {
    try {
        const result = await userService.getUsers(req.query);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
};

// Mostrar un usuario por su ID.
const getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: { code: "NOT_FOUND", message: "Usuario no encontrado" }
            });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// Modificar un usuario.
const updateUser = async (req, res, next) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: { code: "NOT_FOUND", message: "Usuario no encontrado" }
            });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// Desactivar un usuario.
const deleteUser = async (req, res, next) => {
    try {
        const user = await userService.deleteUser(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: { code: "NOT_FOUND", message: "Usuario no encontrado" }
            });
        }

        res.status(200).json({
            success: true,
            message: "Usuario desactivado"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};
