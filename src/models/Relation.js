import Usuario from './Usuario.js';
import Producto from './Producto.js';
import Orden from './Orden.js';
import OrderProduct from './OrderProduct.js';
import Serie from './Serie.js';

// Definir las relaciones
Usuario.hasMany(Orden, { foreignKey: 'usuarioId' });
Orden.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Serie.hasMany(Producto, { foreignKey: 'serieId' });
Producto.belongsTo(Serie, { foreignKey: 'serieId' });

Orden.belongsToMany(Producto, { through: OrderProduct, foreignKey: 'ordenId' });
Producto.belongsToMany(Orden, { through: OrderProduct, foreignKey: 'productoId' });

export { Usuario, Producto, Orden, OrderProduct, Serie };
