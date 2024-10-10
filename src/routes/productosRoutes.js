

const express = require('express');
const router = express.Router();
const productoControllers = require('../controllers/productoControllers');


// Endpoints manuales
router.get('/', productoControllers.getAllProductos);
router.post('/', productoControllers.addProducto);

//router.get('/:id', userController.getUserById);
router.put('/:id', productoControllers.updateProduct);
router.delete('/:id', productoControllers.deleteProduct);

module.exports = router;