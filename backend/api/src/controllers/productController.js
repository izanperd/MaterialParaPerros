
const productService = require("../services/productService");

// Crear un producto.
const createProduct = async (req, res, next) => {
    try {
        const product = await productService.createProduct(req.body);

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// Mostrar todos los productos.
const getProducts = async (req, res, next) => {
    try {
        const products = await productService.getProducts();

        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

// Buscar un producto por su ID.
const getProductById = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);

        if (!product) {
            const error = new Error("Producto no encontrado");
            error.status = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// Modificar un producto.
const updateProduct = async (req, res, next) => {
    try {
        const product = await productService.updateProduct(
            req.params.id,
            req.body
        );

        if (!product) {
            const error = new Error("Producto no encontrado");
            error.status = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// Eliminar un producto.
const deleteProduct = async (req, res, next) => {
    try {
        const product = await productService.deleteProduct(req.params.id);

        if (!product) {
            const error = new Error("Producto no encontrado");
            error.status = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: "Producto eliminado correctamente"
        });
    } catch (error) {
        next(error);
    }
};

// Exportamos las funciones.
module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
