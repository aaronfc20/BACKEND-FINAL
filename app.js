import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import productoRoutes from './src/routes/productoRoutes.js';
import usuarioRoutes from './src/routes/usuarioRoutes.js';
import ordenRoutes from './src/routes/ordenRoutes.js';
import serieRoutes from './src/routes/serieRoutes.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/productos', productoRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/ordenes', ordenRoutes);
app.use('/series', serieRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Hello World", code: "201" });
});

export default app;
