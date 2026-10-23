
const Product = require('../models/Product');

// Crear un producto
const createProduct = async (productData) => {
  const newProduct = new Product(productData);
  return await newProduct.save();
};

// Obtener todos los productos
const getProducts = async () => {
  return await Product.find();
};

// Obtener un producto por su ID
const getProductById = async (id) => {
  return await Product.findById(id);
};

// Modificar un producto
const updateProduct = async (id, productData) => {
  return await Product.findByIdAndUpdate(
    id,
    productData,
    {
      new: true,
      runValidators: true
    }
  );
};

// Eliminar un producto
const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
