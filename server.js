const express = require('express');
const cors = require('cors'); // Importar cors
const fs = require('fs');
const path = require('path');
const productoRoutes = require('./src/routes/productosRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Habilitar CORS para todas las rutas
app.use(cors());

// Middlewares
app.use(express.json());


// Rutas
app.use('/api/producto', productoRoutes);


// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
