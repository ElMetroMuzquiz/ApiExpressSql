
const express = require('express');
const router = express.Router();
const DetallePedidoControlador = require('../controlador/detallePedidoControlador');

router.get('/ventas-producto', DetallePedidoControlador.ventasPorProducto);
router.get('/', DetallePedidoControlador.obtenerTodos);
router.get('/:id', DetallePedidoControlador.obtenerPorId);
router.post('/', DetallePedidoControlador.crear);
router.put('/:id', DetallePedidoControlador.actualizar);
router.delete('/:id', DetallePedidoControlador.eliminar);

module.exports = router;
