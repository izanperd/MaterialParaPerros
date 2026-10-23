
const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

// Crear un producto
router.post('/', productController.createProduct);

// Obtener todos los productos
router.get('/', productController.getProducts);

// Obtener un producto por su ID
router.get('/:id', productController.getProductById);

// Modificar un producto
router.put('/:id', productController.updateProduct);

// Eliminar un producto
router.delete('/:id', productController.deleteProduct);

module.exports = router;
