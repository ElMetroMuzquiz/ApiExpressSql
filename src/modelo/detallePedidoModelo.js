
const pool = require('../config/bd');

class DetallePedidoModelo {

    static async obtenerTodos() {
        const [rows] = await pool.query(`
            SELECT d.id_detalle, d.id_pedido,
                   d.id_producto, p.nombre AS producto,
                   d.cantidad, d.precio,
                   (d.cantidad * d.precio) AS subtotal
            FROM detalle_pedido d
            INNER JOIN productos p
                ON d.id_producto = p.id_producto
            INNER JOIN pedidos pe
                ON d.id_pedido = pe.id_pedido
        `);
        return rows;
    }

    static async obtenerPorId(id) {
        const [rows] = await pool.query(`
            SELECT d.id_detalle, d.id_pedido,
                   d.id_producto, p.nombre AS producto,
                   d.cantidad, d.precio,
                   (d.cantidad * d.precio) AS subtotal
            FROM detalle_pedido d
            INNER JOIN productos p
                ON d.id_producto = p.id_producto
            INNER JOIN pedidos pe
                ON d.id_pedido = pe.id_pedido
            WHERE d.id_detalle = ?
        `, [id]);
        return rows[0];
    }

    static async crear(id_pedido, id_producto, cantidad, precio) {
        const [result] = await pool.query(
            `INSERT INTO detalle_pedido
             (id_pedido, id_producto, cantidad, precio)
             VALUES (?, ?, ?, ?)`,
            [id_pedido, id_producto, cantidad, precio]
        );

        return {
            id_detalle: result.insertId,
            id_pedido,
            id_producto,
            cantidad,
            precio
        };
    }

    static async actualizar(id, id_pedido, id_producto, cantidad, precio) {
        const [result] = await pool.query(
            `UPDATE detalle_pedido
             SET id_pedido = ?, id_producto = ?,
                 cantidad = ?, precio = ?
             WHERE id_detalle = ?`,
            [id_pedido, id_producto, cantidad, precio, id]
        );
        return result.affectedRows;
    }

    static async eliminar(id) {
        const [result] = await pool.query(
            'DELETE FROM detalle_pedido WHERE id_detalle = ?',
            [id]
        );
        return result.affectedRows;
    }

    static async obtenerPorPedido(id_pedido) {
    const [rows] = await pool.query(`
        SELECT d.id_detalle, d.id_pedido,
               d.id_producto, p.nombre AS producto,
               d.cantidad, d.precio,
               (d.cantidad * d.precio) AS subtotal
        FROM detalle_pedido d
        INNER JOIN productos p
            ON d.id_producto = p.id_producto
        INNER JOIN pedidos pe
            ON d.id_pedido = pe.id_pedido
        WHERE d.id_pedido = ?
    `, [id_pedido]);

    return rows;
}

    static async obtenerVentasPorProducto() {
        const [rows] = await pool.query(`
            SELECT p.id_producto,
                   p.nombre AS producto,
                   SUM(d.cantidad) AS unidades_vendidas,
                   SUM(d.cantidad * d.precio) AS total_vendido
            FROM detalle_pedido d
            INNER JOIN productos p
                ON d.id_producto = p.id_producto
            GROUP BY p.id_producto, p.nombre
            ORDER BY unidades_vendidas DESC
        `);
        return rows;
    }
}

module.exports = DetallePedidoModelo;
