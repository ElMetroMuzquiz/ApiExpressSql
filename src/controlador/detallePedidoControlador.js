
const DetallePedidoModelo = require('../modelo/detallePedidoModelo');
const pool = require('../config/bd');

class DetallePedidoControlador {

    static async obtenerTodos(req, res) {
        try {
            const datos = await DetallePedidoModelo.obtenerTodos();
            res.status(200).json({ exito: true, datos });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener detalles' });
        }
    }

    static async obtenerPorId(req, res) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({ mensaje: 'ID inválido' });
            }

            const detalle = await DetallePedidoModelo.obtenerPorId(id);

            if (!detalle) {
                return res.status(404).json({
                    mensaje: 'Detalle no encontrado'
                });
            }

            res.status(200).json({ exito: true, datos: detalle });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al buscar detalle' });
        }
    }

    static async crear(req, res) {
        try {
            const { id_pedido, id_producto, cantidad, precio } = req.body;

            if (!Number.isInteger(id_pedido) || id_pedido <= 0 ||
                !Number.isInteger(id_producto) || id_producto <= 0 ||
                !Number.isInteger(cantidad) || cantidad <= 0 ||
                typeof precio !== 'number' || !Number.isFinite(precio) || precio < 0) {
                return res.status(400).json({
                    mensaje: 'Datos inválidos para el detalle'
                });
            }

            const [pedidos] = await pool.query(
                'SELECT id_pedido FROM pedidos WHERE id_pedido = ?',
                [id_pedido]
            );

            const [productos] = await pool.query(
                'SELECT id_producto FROM productos WHERE id_producto = ?',
                [id_producto]
            );

            if (pedidos.length === 0 || productos.length === 0) {
                return res.status(404).json({
                    mensaje: 'El pedido o producto no existe'
                });
            }

            const detalle = await DetallePedidoModelo.crear(
                id_pedido, id_producto, cantidad, precio
            );

            res.status(201).json({ exito: true, datos: detalle });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al crear detalle' });
        }
    }

    static async actualizar(req, res) {
        try {
            const id = Number(req.params.id);
            const { id_pedido, id_producto, cantidad, precio } = req.body;

            if (!Number.isInteger(id) || id <= 0 ||
                !Number.isInteger(id_pedido) || id_pedido <= 0 ||
                !Number.isInteger(id_producto) || id_producto <= 0 ||
                !Number.isInteger(cantidad) || cantidad <= 0 ||
                typeof precio !== 'number' || !Number.isFinite(precio) || precio < 0) {
                return res.status(400).json({
                    mensaje: 'Datos inválidos'
                });
            }

            const existe = await DetallePedidoModelo.obtenerPorId(id);

            if (!existe) {
                return res.status(404).json({
                    mensaje: 'Detalle no encontrado'
                });
            }

            const [pedidos] = await pool.query(
                'SELECT id_pedido FROM pedidos WHERE id_pedido = ?',
                [id_pedido]
            );

            const [productos] = await pool.query(
                'SELECT id_producto FROM productos WHERE id_producto = ?',
                [id_producto]
            );

            if (pedidos.length === 0 || productos.length === 0) {
                return res.status(404).json({
                    mensaje: 'El pedido o producto no existe'
                });
            }

            await DetallePedidoModelo.actualizar(
                id, id_pedido, id_producto, cantidad, precio
            );

            res.status(200).json({
                exito: true,
                mensaje: 'Detalle actualizado correctamente'
            });
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al actualizar detalle'
            });
        }
    }

    static async eliminar(req, res) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({ mensaje: 'ID inválido' });
            }

            const existe = await DetallePedidoModelo.obtenerPorId(id);

            if (!existe) {
                return res.status(404).json({
                    mensaje: 'Detalle no encontrado'
                });
            }

            await DetallePedidoModelo.eliminar(id);

            res.status(200).json({
                exito: true,
                mensaje: 'Detalle eliminado correctamente'
            });
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al eliminar detalle'
            });
        }
    }
    static async obtenerPorPedido(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'ID de pedido inválido'
            });
        }

        const datos = await DetallePedidoModelo.obtenerPorPedido(id);

        res.status(200).json({
            exito: true,
            datos
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar detalles del pedido'
        });
    }
}

    static async ventasPorProducto(req, res) {
        try {
            const datos = await DetallePedidoModelo.obtenerVentasPorProducto();
            res.status(200).json({ exito: true, datos });
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al consultar ventas por producto'
            });
        }
    }
}

module.exports = DetallePedidoControlador;
