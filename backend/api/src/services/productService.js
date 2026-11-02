
const mongoose = require("mongoose");
const Product = require("../models/Product");

// Comprobar que el ID sea válido.
const checkId = (id) => {
    if (!mongoose.isValidObjectId(id)) {
        const error = new Error("El ID del producto no es válido");
        error.status = 400;
        throw error;
    }
};

// Crear un producto.
const createProduct = async (productData) => {
    const newProduct = new Product(productData);
    return await newProduct.save();
};

// Mostrar todos los productos.
const getProducts = async () => {
    return await Product.find().populate("categoriaId");
};

// Buscar un producto por su ID.
const getProductById = async (id) => {
    checkId(id);
    return await Product.findById(id).populate("categoriaId");
};

// Modificar un producto.
const updateProduct = async (id, productData) => {
    checkId(id);

    return await Product.findByIdAndUpdate(
        id,
        productData,
        {
            new: true,
            runValidators: true
        }
    ).populate("categoriaId");
};

// Eliminar un producto.
const deleteProduct = async (id) => {
    checkId(id);
    return await Product.findByIdAndDelete(id);
};

// Exportamos las funciones.
module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
