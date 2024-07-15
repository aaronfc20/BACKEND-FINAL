import Serie from '../models/Serie.js';
import Producto from '../models/Producto.js';
import { sequelize } from '../config/database.js';

export const getSeries = async (req, res) => {
    try {
        const series = await Serie.findAll({
            include: [{
                model: Producto,
                attributes: []
            }],
            attributes: [
                "id",
                "nombre",
                "descripcion",
                "fechaCreacion",
                "numeroProductos",
                "imgUrl",
                [sequelize.fn("COUNT", sequelize.col("Productos.id")), "nroproductos"]
            ],
            group: [
                "Serie.id",
                "Serie.nombre",
                "Serie.descripcion",
                "Serie.fechaCreacion",
                "Serie.numeroProductos",
                "Serie.imgUrl"
            ]
        });
        res.json(series);
    } catch (error) {
        console.error('Error al obtener series:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getSerieById = async (req, res) => {
    const { id } = req.params;
    try {
        const serie = await Serie.findByPk(id, {
            include: Producto,
            attributes: {
                include: [
                    [sequelize.fn("COUNT", sequelize.col("Productos.id")), "numeroProductos"]
                ]
            },
            group: ["Serie.id", "Productos.id"]
        });
        if (!serie) {
            return res.status(404).json({ error: "Serie no encontrada" });
        }
        res.json(serie);
    } catch (error) {
        console.error('Error al obtener serie:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const createSerie = async (req, res) => {
    const { nombre, descripcion, fechaCreacion, productos } = req.body;
    try {
        const nuevaSerie = await Serie.create({
            nombre,
            descripcion,
            fechaCreacion,
            numeroProductos: productos.length
        });
        for (const productoNombre of productos) {
            const producto = await Producto.findOne({ where: { nombre: productoNombre } });
            if (producto) {
                producto.serieId = nuevaSerie.id;
                await producto.save();
            }
        }
        res.status(201).json(nuevaSerie);
    } catch (error) {
        console.error('Error al crear serie:', error);
        res.status(500).json({ error: 'Error interno al crear la serie' });
    }
};

export const updateSerie = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, productos } = req.body;
    try {
        const serie = await Serie.findByPk(id);
        if (!serie) {
            return res.status(404).json({ error: "Serie no encontrada" });
        }
        serie.nombre = nombre || serie.nombre;
        serie.descripcion = descripcion || serie.descripcion;
        await serie.save();
        if (productos && productos.length > 0) {
            await Producto.update({ serieId: null }, { where: { serieId: id } });
            for (const productName of productos) {
                const producto = await Producto.findOne({ where: { nombre: productName } });
                if (producto) {
                    producto.serieId = id;
                    await producto.save();
                }
            }
        }
        res.status(200).json({ message: "Serie actualizada exitosamente" });
    } catch (error) {
        console.error('Error al actualizar serie:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const deleteSerie = async (req, res) => {
    const { id } = req.params;
    try {
        const serie = await Serie.findByPk(id);
        if (!serie) {
            return res.status(404).json({ error: "Serie no encontrada" });
        }
        await Producto.update({ serieId: null }, { where: { serieId: id } });
        await serie.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar serie:', error);
        res.status(500).json({ error: 'Error interno al eliminar la serie' });
    }
};
