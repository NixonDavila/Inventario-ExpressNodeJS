const fs = require('fs').promises; // Usar fs.promises para evitar callbacks
const path = require('path');

// Definir ruta del archivo config.json
const filePath = path.join(__dirname, 'config.json');

// Leer el archivo
const leerJson = async () => {
    try {
        const data = await fs.readFile(filePath, "utf8"); // Aquí sí usamos 'utf8' para leer
        return JSON.parse(data);
    } catch (err) {
        console.error('Error al leer el archivo JSON:', err);
        return [];
    }
}

// Escribir en config.json
const escribirJSON = async (data) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(data)); // escribe en el archivo Json
    } catch (error) {
        console.error('Error al escribir el archivo JSON:', error);
    }
}

// Obtener todos los productos
const getAllProductos = async (req, res) => {
    try {
        const productos = await leerJson();// leer productos
        
        // Simulación de error si no hay productos
        if (productos.length === 0) {
            return 'No se encontraron productos';
        }else{
            res.json(productos);
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
};


// Agregar un nuevo producto
const addProducto = async (req, res) => {
    try {
        const { name, price, description, stock } = req.body; // requisitos

        // Validaciones básicas
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ message: 'El nombre es obligatorio y debe ser un texto.' });
        }             //isNaN devuelve un bolleano si no es un numero
        if (!price || isNaN(price) || price <= 0) {
            return res.status(400).json({ message: 'El precio es obligatorio y debe ser un número mayor a 0.' });
        }
        if (description && typeof description !== 'string') {
            return res.status(400).json({ message: 'La descripción debe ser un texto.' });
        }
        if (stock && (isNaN(stock) || stock < 0)) {
            return res.status(400).json({ message: 'El stock debe ser un número mayor o igual a 0.' });
        }

        const productos = await leerJson(); // leer productos
        const nuevoProducto = {
            id: productos.length + 1, // no permite que el id sea el mismo
            name: name.trim(), // sanitizamos el nombre quitando espacios
            price: parseFloat(price), // aseguramos que el precio sea un número flotante
            description: description ? description.trim() : '',
            stock: stock ? parseInt(stock) : 0 // si no se pasa stock, se asigna 0
        };

        productos.push(nuevoProducto); // insertamos lo guardado en productos
        await escribirJSON(productos); // escribimos en el archivo JSON

        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};


//Eliminamos un producto
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params; //buscamos el producto por el id
        let productos = await leerJson(); // Leer productos
        const productoIndex = productos.findIndex(producto => producto.id === parseInt(id));// buscamos el entre los producto el id especifico

        if (productoIndex === -1) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }

        productos.splice(productoIndex, 1);
        await escribirJSON(productos); // Guardar cambios
        res.status(200).json({ message: 'Producto eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// Editar producto
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, stock } = req.body;
        let productos = await leerJson(); // leer productos

        const productoIndex = productos.findIndex(producto => producto.id === parseInt(id));
        if (productoIndex === -1) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }

        // Validaciones básicas antes de actualizar
        if (name && (typeof name !== 'string' || name.trim() === '')) {
            return res.status(400).json({ message: 'El nombre debe ser un texto válido.' });
        }
        if (price && (isNaN(price) || price <= 0)) {
            return res.status(400).json({ message: 'El precio debe ser un número mayor a 0.' });
        }
        if (description && typeof description !== 'string') {
            return res.status(400).json({ message: 'La descripción debe ser un texto.' });
        }
        if (stock && (isNaN(stock) || stock < 0)) {
            return res.status(400).json({ message: 'El stock debe ser un número mayor o igual a 0.' });
        }

        // Actualizamos solo los campos que se envían
        if (name) productos[productoIndex].name = name.trim();
        if (price) productos[productoIndex].price = parseFloat(price);
        if (description) productos[productoIndex].description = description.trim();
        if (stock) productos[productoIndex].stock = parseInt(stock);

        await escribirJSON(productos); // Guardar cambios
        res.status(200).json({ message: 'Producto actualizado exitosamente.', producto: productos[productoIndex] });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};


module.exports = {
    getAllProductos,
    addProducto,
    deleteProduct,
    updateProduct
};
