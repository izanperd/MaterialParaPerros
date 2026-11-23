
const userService = require("../services/userService");
const tokenService = require("../services/tokenService");

// Registrar un usuario.
const register = async (req, res, next) => {
    try {
        const user = await userService.register(req.body);

        res.status(201).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// Iniciar sesión y generar los dos tokens.
const login = async (req, res, next) => {
    try {
        const result = await tokenService.login(req.body);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// Renovar los tokens.
const refresh = async (req, res, next) => {
    try {
        const result = await tokenService.refresh(req.body.refreshToken);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// Cerrar sesión.
const logout = async (req, res, next) => {
    try {
        const result = await tokenService.logout(req.body.refreshToken);

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

// Mostrar los datos del usuario que ha iniciado sesión.
const getMe = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.user.id);

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

// Mostrar todos los usuarios.
const getUsers = async (req, res, next) => {
    try {
        const result = await userService.getUsers(req.query);

        res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        next(error);
    }
};

// Buscar un usuario por su ID.
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
        const user = await userService.updateUser(req.params.id, req.body);

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
            message: "Usuario desactivado correctamente"
        });
    } catch (error) {
        next(error);
    }
};

// Exportamos las funciones.
module.exports = {
    register,
    login,
    refresh,
    logout,
    getMe,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};
