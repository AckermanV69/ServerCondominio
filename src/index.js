import express from 'express';
import cors from 'cors'; 
import morgan from 'morgan';
import { PORT, HOST } from './config.js';

// Importación de rutas
import userRoutes from './routes/user_routes.js';
import products_routes from './routes/productos_routes.js';
import pagosRoutes from './routes/pagos_routes.js';
import condominioRoutes from './routes/condominioRoutes.js'; 

const app = express();

// --- Middlewares ---
app.use(cors()); 
app.use(morgan('dev'));
app.use(express.json()); 

// --- Definición de Rutas ---
app.use('/api', userRoutes);
app.use('/api/productos', products_routes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/condominios', condominioRoutes); 

// --- Encendido del Servidor ---
app.listen(PORT, HOST, () => {
    console.log(`Servidor listo en http://${HOST}:${PORT}`);
});