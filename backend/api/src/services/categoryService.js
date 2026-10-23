
const Category = require("../models/Category");

// Crear una categoría nueva.
const createCategory = async (data) => {
    return await Category.create(data);
};

// Buscar todas las categorías, con filtros, orden y paginación.
const getCategories = async (query) => {
    const filter = {};

    // Si nos piden solo las categorías activas o inactivas, aplicamos el filtro.
    if (query.active !== undefined) {
        if (query.active !== "true" && query.active !== "false") {
            const error = new Error("El campo active debe ser true o false");
            error.status = 400;
            throw error;
        }

        filter.active = query.active === "true";
    }

    // Buscar categorías cuyo nombre contenga el texto recibido.
    if (query.name) {
        filter.name = {
            $regex: query.name,
            $options: "i"
        };
    }

    // Elegir la página y cuántos resultados mostramos.
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);

    // Comprobar que los números sean válidos.
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

    // Elegir cómo ordenar los resultados.
    const allowedSorts = ["name", "-name", "createdAt", "-createdAt"];
    const sort = query.sort || "name";

    if (!allowedSorts.includes(sort)) {
        const error = new Error("El orden solicitado no es válido");
        error.status = 400;
        throw error;
    }

    // Buscar las categorías y contar cuántas hay en total.
    const total = await Category.countDocuments(filter);
    const categories = await Category.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);

    return {
        data: categories,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

// Buscar una categoría concreta por su ID.
const getCategoryById = async (id) => {
    return await Category.findById(id);
};

// Modificar una categoría existente.
const updateCategory = async (id, data) => {
    return await Category.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    });
};

// Eliminar una categoría.
const deleteCategory = async (id) => {
    return await Category.findByIdAndDelete(id);
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
