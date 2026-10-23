
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Crear un usuario y convertir su contraseña en un hash.
const createUser = async (data) => {
    if (typeof data.password !== "string" || data.password.length < 12) {
        const error = new Error("La contraseña debe tener al menos 12 caracteres");
        error.status = 400;
        throw error;
    }

    // Comprobamos que solo se reciban los campos permitidos.
    const allowedFields = ["name", "email", "password"];
    const receivedFields = Object.keys(data);
    const forbiddenFields = receivedFields.filter(
        (field) => !allowedFields.includes(field)
    );

    if (forbiddenFields.length > 0) {
        const error = new Error("Hay campos que no se pueden enviar");
        error.status = 400;
        throw error;
    }

    // Convertimos la contraseña original en un hash.
    const passwordHash = await bcrypt.hash(data.password, 10);

    // El servidor asigna el rol client por seguridad.
    return await User.create({
        name: data.name,
        email: data.email,
        passwordHash,
        role: "client"
    });
};

// Mostrar usuarios con filtros, orden y paginación.
const getUsers = async (query) => {
    const filter = {};

    // Buscar usuarios por nombre.
    if (query.name) {
        filter.name = { $regex: query.name, $options: "i" };
    }

    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);

    // Evitar páginas o límites incorrectos.
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

    // Solo permitimos estos órdenes.
    const allowedSorts = ["name", "-name", "createdAt", "-createdAt"];
    const sort = query.sort || "name";

    if (!allowedSorts.includes(sort)) {
        const error = new Error("El orden solicitado no es válido");
        error.status = 400;
        throw error;
    }

    const total = await User.countDocuments(filter);
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
    return await User.findById(id);
};

// Modificar solo los campos permitidos.
const updateUser = async (id, data) => {
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

    if (data.name !== undefined) updates.name = data.name;
    if (data.email !== undefined) updates.email = data.email;
    if (data.active !== undefined) updates.active = data.active;

    // Si se cambia la contraseña, guardamos su hash.
    if (data.password !== undefined) {
        if (
            typeof data.password !== "string" ||
            data.password.length < 12
        ) {
            const error = new Error("La contraseña debe tener al menos 12 caracteres");
            error.status = 400;
            throw error;
        }

        updates.passwordHash = await bcrypt.hash(data.password, 10);
    }

    return await User.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true
    });
};

// En lugar de borrar el usuario, lo desactivamos.
const deleteUser = async (id) => {
    return await User.findByIdAndUpdate(
        id,
        { active: false },
        { new: true }
    );
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};
