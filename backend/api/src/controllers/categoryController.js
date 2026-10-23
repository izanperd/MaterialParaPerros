
const categoryService = require("../services/categoryService");

// Crear una categoría.
const createCategory = async (req, res, next) => {
    try {
        const category = await categoryService.createCategory(req.body);
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
};

// Mostrar todas las categorías.
const getCategories = async (req, res, next) => {
    try {
        const result = await categoryService.getCategories(req.query);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
};

// Mostrar una categoría por su ID.
const getCategoryById = async (req, res, next) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                error: { code: "NOT_FOUND", message: "Categoría no encontrada" }
            });
        }

        res.status(200).json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
};

// Modificar una categoría.
const updateCategory = async (req, res, next) => {
    try {
        const category = await categoryService.updateCategory(
            req.params.id,
            req.body
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                error: { code: "NOT_FOUND", message: "Categoría no encontrada" }
            });
        }

        res.status(200).json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
};

// Eliminar una categoría.
const deleteCategory = async (req, res, next) => {
    try {
        const category = await categoryService.deleteCategory(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                error: { code: "NOT_FOUND", message: "Categoría no encontrada" }
            });
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
