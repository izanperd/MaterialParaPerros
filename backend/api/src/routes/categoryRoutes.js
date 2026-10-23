
const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");

// Cada ruta llama a la función que corresponde.
router.post("/", categoryController.createCategory);
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
