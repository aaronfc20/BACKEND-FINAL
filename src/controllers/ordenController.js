import Orden from '../models/Orden.js';
import OrderProduct from '../models/OrderProduct.js';
import Producto from '../models/Producto.js';

export const getOrdenes = async (req, res) => {
    const usuarioId = req.query.usuarioId;
    if (!usuarioId) {
        return res.status(400).json({ error: 'usuarioId es requerido' });
    }
    try {
        const ordenes = await Orden.findAll({ where: { usuarioId } });
        res.json(ordenes);
    } catch (error) {
        console.error('Error al obtener órdenes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getOrdenById = async (req, res) => {
    const { id } = req.params;
    try {
        const orden = await Orden.findByPk(id, {
            include: [{
                model: OrderProduct,
                include: [Producto]
            }]
        });
        if (!orden) {
            return res.status(404).json({ message: "Orden no encontrada" });
        }
        res.json(orden);
    } catch (error) {
        console.error('Error al obtener orden:', error);
        res.status(500).json({ message: 'Error al obtener orden' });
    }
};

export const createOrden = async (req, res) => {
    const { shippingAddress, paymentMethod, cartItems, total, shippingMethod, userId } = req.body;
    try {
        const newOrder = await Orden.create({
            direccion: shippingAddress,
            metodoPago: paymentMethod,
            metodoEnvio: shippingMethod,
            total,
            estado: 'pendiente',
            usuarioId: userId
        });
        for (const item of cartItems) {
            await OrderProduct.create({
                ordenId: newOrder.id,
                productoId: item.id,
                cantidad: item.cantidad
            });
            const producto = await Producto.findByPk(item.id);
            if (producto) {
                producto.stock -= item.cantidad;
                await producto.save();
            }
        }
        res.json(newOrder);
    } catch (error) {
        console.error('Error al crear orden:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const updateOrden = async (req, res) => {
    const { id } = req.params;
    const { fechaOrden, total, estado, metodoEnvio, metodoPago, direccion } = req.body;
    try {
        const orden = await Orden.findByPk(id);
        if (!orden) {
            return res.status(404).json({ error: "Orden no encontrada" });
        }
        await orden.update({ fechaOrden, total, estado, metodoEnvio, metodoPago, direccion });
        res.json(orden);
    } catch (error) {
        console.error('Error al actualizar orden:', error);
        res.status(500).json({ error: 'Error interno al actualizar orden' });
    }
};

export const deleteOrden = async (req, res) => {
    const { id } = req.params;
    try {
        const orden = await Orden.findByPk(id);
        if (!orden) {
            return res.status(404).json({ message: "Orden no encontrada" });
        }
        await OrderProduct.destroy({ where: { ordenId: id } });
        await orden.destroy();
        res.status(200).json({ message: "Orden cancelada exitosamente" });
    } catch (error) {
        console.error('Error al cancelar orden:', error);
        res.status(500).json({ message: 'Error al cancelar orden' });
    }
};
