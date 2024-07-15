import Producto from '../models/Producto.js';

export const getProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getProductoById = async (req, res) => {
    const { id } = req.params;
    try {
        const producto = await Producto.findByPk(id);
        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const createProducto = async (req, res) => {
    const { nombre, descripcion, caracteristicas, editor, precio, stock, imageUrl } = req.body;
    try {
        const nuevoProducto = await Producto.create({
            nombre,
            descripcion,
            caracteristicas,
            editor,
            precio,
            stock,
            estado: "Activo",
            imageUrl: imageUrl || ""
        });
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const updateProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, editor, precio, fechaRegistro, stock } = req.body;
    try {
        const producto = await Producto.findByPk(id);
        if (producto) {
            producto.nombre = nombre || producto.nombre;
            producto.editor = editor || producto.editor;
            producto.precio = precio || producto.precio;
            producto.fechaRegistro = fechaRegistro || producto.fechaRegistro;
            producto.stock = stock || producto.stock;
            await producto.save();
            res.json(producto);
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const deleteProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const producto = await Producto.findByPk(id);
        if (producto) {
            producto.estado = "Eliminado";
            await producto.save();
            res.json({ message: "Producto eliminado" });
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

