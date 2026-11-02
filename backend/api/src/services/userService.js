
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Comprobar que el ID de MongoDB sea válido.
const checkId = (id) => {
    if (!mongoose.isValidObjectId(id)) {
        const error = new Error("El ID del usuario no es válido");
        error.status = 400;
        throw error;
    }
};

// Registrar un usuario nuevo.
const register = async (data) => {

    // Comprobamos que se hayan enviado los datos.
    if (!data.name || !data.email || !data.password) {
        const error = new Error("Faltan datos para registrar el usuario");
        error.status = 400;
        throw error;
    }

    // Solo permitimos estos tres campos.
    const allowedFields = ["name", "email", "password"];

    const receivedFields = Object.keys(data);

    const forbiddenFields = receivedFields.filter(
        (field) => !allowedFields.includes(field)
    );

    if (forbiddenFields.length > 0) {
        const error = new Error("Hay campos no permitidos");
        error.status = 400;
        throw error;
    }

    // Comprobamos el nombre.
    if (typeof data.name !== "string" || data.name.trim().length < 2) {
        const error = new Error("El nombre debe tener al menos 2 caracteres");
        error.status = 400;
        throw error;
    }

    // Comprobamos el email.
    if (
        typeof data.email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
    ) {
        const error = new Error("El email no tiene un formato válido");
        error.status = 400;
        throw error;
    }

    // Comprobamos la contraseña.
    if (
        typeof data.password !== "string" ||
        data.password.length < 12
    ) {
        const error = new Error("La contraseña debe tener al menos 12 caracteres");
        error.status = 400;
        throw error;
    }

    // Ponemos el email en minúsculas.
    const email = data.email.trim().toLowerCase();

    // Comprobamos si el email ya existe.
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        const error = new Error("Este email ya está registrado");
        error.status = 409;
        throw error;
    }

    // Convertimos la contraseña en un hash.
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Guardamos el usuario en MongoDB.
    const user = await User.create({
        name: data.name.trim(),
        email,
        passwordHash,
        role: "client"
    });

    return user;
};

// Iniciar sesión.
const login = async (data) => {

    // Comprobamos que se hayan enviado los datos.
    if (!data.email || !data.password) {
        const error = new Error("Introduce el email y la contraseña");
        error.status = 400;
        throw error;
    }

    // Comprobamos que exista la clave JWT.
    if (!process.env.JWT_SECRET) {
        throw new Error("Falta JWT_SECRET en el archivo .env");
    }

    // Buscamos al usuario por su email.
    // También pedimos el hash porque está oculto.
    const user = await User.findOne({
        email: data.email.trim().toLowerCase()
    }).select("+passwordHash");

    // Comprobamos que el usuario exista y esté activo.
    if (!user || !user.active) {
        const error = new Error("Email o contraseña incorrectos");
        error.status = 401;
        throw error;
    }

    // Comparamos la contraseña con el hash.
    const passwordCorrect = await bcrypt.compare(
        data.password,
        user.passwordHash
    );

    if (!passwordCorrect) {
        const error = new Error("Email o contraseña incorrectos");
        error.status = 401;
        throw error;
    }

    // Creamos el token JWT.
    const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    // Devolvemos el usuario y el token.
    return {
        user: user.toJSON(),
        token
    };
};

// Mostrar todos los usuarios.
const getUsers = async (query) => {
    const filter = {};

    // Buscar usuarios por nombre.
    if (query.name) {
        filter.name = {
            $regex: query.name,
            $options: "i"
        };
    }

    // Elegir página y cantidad de resultados.
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);

    // Comprobar que los números sean correctos.
    if (
        !Number.isInteger(page) ||
        !Number.isInteger(limit) ||
        page < 1 ||
        limit < 1 ||
        limit > 100
    ) {
        const error = new Error("La página o el límite no son válidos");
        error.status = 400;
        throw error;
    }

    // Elegir cómo ordenar los usuarios.
    const allowedSorts = ["name", "-name", "createdAt", "-createdAt"];
    const sort = query.sort || "name";

    if (!allowedSorts.includes(sort)) {
        const error = new Error("El orden solicitado no es válido");
        error.status = 400;
        throw error;
    }

    // Contar los usuarios.
    const total = await User.countDocuments(filter);

    // Buscar los usuarios.
    const users = await User.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);

    return {
        data: users,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

// Buscar un usuario por su ID.
const getUserById = async (id) => {

    // Comprobamos el ID antes de buscar.
    checkId(id);

    return await User.findById(id);
};

// Modificar un usuario.
const updateUser = async (id, data) => {

    // Comprobamos el ID.
    checkId(id);

    // Solo permitimos modificar estos campos.
    const allowedFields = ["name", "email", "password", "active"];

    const receivedFields = Object.keys(data);

    const forbiddenFields = receivedFields.filter(
        (field) => !allowedFields.includes(field)
    );

    if (forbiddenFields.length > 0) {
        const error = new Error("No puedes modificar esos campos");
        error.status = 400;
        throw error;
    }

    const updates = {};

    // Actualizar el nombre.
    if (data.name !== undefined) {
        updates.name = data.name;
    }

    // Actualizar el email.
    if (data.email !== undefined) {
        updates.email = data.email.trim().toLowerCase();
    }

    // Actualizar el estado.
    if (data.active !== undefined) {
        updates.active = data.active;
    }

    // Cambiar la contraseña si se ha enviado una nueva.
    if (data.password !== undefined) {

        if (
            typeof data.password !== "string" ||
            data.password.length < 12
        ) {
            const error = new Error("La contraseña debe tener al menos 12 caracteres");
            error.status = 400;
            throw error;
        }

        // Guardamos la nueva contraseña como hash.
        updates.passwordHash = await bcrypt.hash(data.password, 10);
    }

    // Guardamos los cambios.
    return await User.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true
    });
};

// Desactivar un usuario sin borrarlo de MongoDB.
const deleteUser = async (id) => {

    // Comprobamos el ID.
    checkId(id);

    return await User.findByIdAndUpdate(
        id,
        { active: false },
        { new: true }
    );
};

// Exportamos las funciones.
module.exports = {
    register,
    login,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};
