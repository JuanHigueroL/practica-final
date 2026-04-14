
// Importa el framework Express
const express = require('express');
// Importa el conector a MySQL
const mysql = require('mysql2');
// Importa el middleware CORS de seguridad para que la página web hable con el servidor (backend)
const cors = require('cors');
const path = require('path');

// Crea una instancia de Express
const app = express();

//activa CORS para el intercambio de datos entre el frontend y el backend
app.use(cors());
// permite que el servidor entienda los datos em formato JSON
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const multer = require('multer');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuración de almacenamiento físico para las imágenes
const storage = multer.diskStorage({
    // Define la carpeta de destino para las imágenes guardadas
    destination: function (req, file, cb) {
        // Esto apunta exactamente a la carpeta 'uploads' fuera del backend
        cb(null, path.join(__dirname, '../uploads')); 
    },
    // Define el nombre del archivo guardado
    filename: function (req, file, cb) {
        // Se renombra el archivo para evitar sobrescrituras (ej: 16789123-imagen.jpg)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Crea el middleware de Multer con la configuración de almacenamiento
const upload = multer({ storage: storage });

//Define la conexión a la base de datos MySQL
const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'juan',
    database:'tienda-db'
});

//Inicia la conexión a la base de datos
db.connect(err => {
    if (err) {
        return;
    }
})



// -------------------------------------  REGISTRO Y LOGIN DE USUARIOS ------------------------------------

//Crea la ruta de tipo POST para registrar un nuevo usuario en la base de datos
// req es la solicitud del cliente, res es la respuesta que el servidor enviará al cliente
app.post('/api/registro', (req, res) => {
    const { nombre, correo, contrasena } = req.body;
    const rol_id = 2; 

    const sql = "INSERT INTO usuarios (nombre, correo, contrasena, rol_id) VALUES (?, ?, ?, ?)";

    const sqlCheck ="SELECT * FROM usuarios WHERE nombre = ? OR correo =?";

    // Primero verificamos si el nombre o correo ya existe
    db.query(sqlCheck, [nombre, correo], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if(results.length > 0) {
            return res.status(400).json({ mensaje:"El nombre de usuario o correo ya está en uso" });
        } else {
            db.query(sql, [nombre, correo, contrasena, rol_id], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ mensaje: "Usuario registrado con éxito", id: result.insertId });
            });
        }
    }); 
});

app.post('/api/login', (req, res) => {
    const { identificador, contrasena } = req.body;

    // La consulta busca en ambas columnas usando el operador OR
    const sql = "SELECT id, nombre, correo, rol_id FROM usuarios WHERE (nombre = ? OR correo = ?) AND contrasena = ?";

    // Pasamos el identificador dos veces (para nombre y para correo) y la contraseña
    db.query(sql, [identificador, identificador, contrasena], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            res.json({
                mensaje: "Login exitoso",
                usuario: results[0]
            });
        } else {
            res.status(401).json({ mensaje: "Credenciales incorrectas" });
        }
    });
});

// ------------------------------------- CREACIÓN Y MODIFICACIÓN DE CATEGORÍAS ------------------------------------

app.get('/api/categorias', (req, res) => {
    const sql = "SELECT * FROM categorias";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/categorias', (req, res) =>{
    const { nombre } = req.body;
    const sql = "INSERT INTO categorias (nombre) VALUES (?)";
    const sqlCheck = "SELECT * FROM categorias WHERE nombre = ?";
    db.query(sqlCheck, [nombre], (err, results) => {
        if (err) return res.status(500).json ({ error : err.message});
        if (results.length > 0) {
            return res.status(400).json({ mensaje : "La categoría ya existe"});
        } else {
            db.query(sql, [nombre], (err, results) => {
            if (err) return res.status(500).json({ error: err.message});
            res.json({ mensaje: "Categoría creada con éxito", id: results.insertId });
        });
        }
    });
});

app.put('/api/categorias/:id', (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    const sqlCheck = "SELECT * FROM categorias WHERE id = ?";
    const sqlUpdate = "UPDATE categorias SET nombre = ? WHERE id = ?";
    db.query(sqlUpdate, [nombre, id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Categoría no encontrada" });
        } else {
            db.query(sqlCheck, [id], (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ mensaje: "Categoría actualizada con éxito", categoria: results[0] });
            });
        }
    });
});

// ------------------------------------- CREACIÓN Y MODIFICACIÓN DE PRODUCTOS ------------------------------------

//Crea la ruta de tipo GET para solicitar la lista de productos a la base de datos
app.get('/api/productos', (req, res)=>{
    const sql = `
        SELECT p.*, 
          COALESCE(
            (SELECT JSON_ARRAYAGG(ruta) FROM imagenes_productos WHERE producto_id = p.id),
            JSON_ARRAY()
          ) AS imagenes
        FROM productos p
    `;
    db.query(sql, (err, results)=>{
        if (err) return res.status(500).json({ error: err.message});
        const mapped = results.map(row => ({
            ...row,
            imagenes: typeof row.imagenes === 'string' ? JSON.parse(row.imagenes) : row.imagenes
        }));
        res.json(mapped);
    });
});

// Crea la ruta de tipo GET para solicitar un producto específico por su ID
app.get('/api/productos/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT p.*, 
          COALESCE(
            (SELECT JSON_ARRAYAGG(ruta) FROM imagenes_productos WHERE producto_id = p.id),
            JSON_ARRAY()
          ) AS imagenes
        FROM productos p WHERE p.id = ?
    `;
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        } else {
            const row = results[0];
            row.imagenes = typeof row.imagenes === 'string' ? JSON.parse(row.imagenes) : row.imagenes;
            res.json(row);
        }
    });
});

//Crea la ruta de tipo GET para solicitar un producto específico a la base de datos
app.get('/api/productos/:nombre', (req, res) => {
    const { nombre } = req.params;
    const sql = `
        SELECT p.*, 
          COALESCE(
            (SELECT JSON_ARRAYAGG(ruta) FROM imagenes_productos WHERE producto_id = p.id),
            JSON_ARRAY()
          ) AS imagenes
        FROM productos p WHERE p.nombre = ?
    `;
    db.query(sql, [nombre], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        } else {
            const row = results[0];
            row.imagenes = typeof row.imagenes === 'string' ? JSON.parse(row.imagenes) : row.imagenes;
            res.json(row);
        }
    });
})

app.get('/api/productos/categoria/:categoria_id', (req, res) => {
    const {categoria_id} = req.params;
    const sql = `
        SELECT p.*, 
          COALESCE(
            (SELECT JSON_ARRAYAGG(ruta) FROM imagenes_productos WHERE producto_id = p.id),
            JSON_ARRAY()
          ) AS imagenes
        FROM productos p WHERE p.categoria_id = ?
    `;
    db.query(sql, [categoria_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        const mapped = results.map(row => ({
            ...row,
            imagenes: typeof row.imagenes === 'string' ? JSON.parse(row.imagenes) : row.imagenes
        }));
        res.json(mapped);
    });
})

// Se añade el middleware 'upload.array('imagenes', 10)' a la ruta
app.post('/api/productos', upload.array('imagenes', 10), (req, res) => {

    const { codigo_unico, nombre, descripcion, precio, stock, categoria_id } = req.body;

    if (!categoria_id || !codigo_unico) {
        return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
    }

    const sqlInsert = "INSERT INTO productos (codigo_unico, nombre, descripcion, precio, stock, categoria_id) VALUES (?, ?, ?, ?, ?, ?)";
    const valores = [codigo_unico, nombre, descripcion, precio, stock, categoria_id];

    db.query(sqlInsert, valores, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const insertId = result.insertId;

        // Si se subieron archivos, se guardan en la tabla imagenes_productos
        if (req.files && req.files.length > 0) {
            const imagenesValores = req.files.map(file => [
                insertId, 
                file.filename, 
                file.filename
            ]);

            const sqlImg = "INSERT INTO imagenes_productos (producto_id, nombre_archivo, ruta) VALUES ?";
            db.query(sqlImg, [imagenesValores], (errImg) => {
                if (errImg) {
                    return res.status(201).json({ 
                        mensaje: "Producto creado, pero hubo un error con las imágenes", 
                        id: insertId,
                        codigo: codigo_unico 
                    });
                }
                res.status(201).json({ 
                    mensaje: "Producto y sus imágenes creados con éxito", 
                    id: insertId,
                    codigo: codigo_unico 
                });
            });
        } else {
            res.status(201).json({ 
                mensaje: "Producto creado con éxito (sin imágenes)", 
                id: insertId,
                codigo: codigo_unico 
            });
        }
    });
});

//Crea la ruta de tipo PUT para actualizar un producto existente en la base de datos
app.put('/api/productos/:id', upload.array('imagenes_nuevas', 10), (req, res) => {
    const { id } = req.params;
    // Permite aceptar datos en form-data o json
    const { nombre, descripcion, precio, stock, categoria_id } = req.body;
    
    const sqlUpdate = "UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria_id = ? WHERE id = ?";
    const sqlGet = `
        SELECT p.*, 
          COALESCE(
            (SELECT JSON_ARRAYAGG(ruta) FROM imagenes_productos WHERE producto_id = p.id),
            JSON_ARRAY()
          ) AS imagenes
        FROM productos p WHERE id = ?
    `;

    // Ejecutamos la actualización principal del producto
    db.query(sqlUpdate, [nombre, descripcion, precio, stock, categoria_id, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // Verificamos si se actualizó algo
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        // Si la petición subió nuevas imágenes, limpiamos las viejas de la base de datos (relación manejada)
        if (req.files && req.files.length > 0) {
            const sqlDeleteImages = "DELETE FROM imagenes_productos WHERE producto_id = ?";
            db.query(sqlDeleteImages, [id], () => {
                const imagenesValores = req.files.map(file => [
                    id, 
                    file.filename, 
                    file.filename
                ]);
                const sqlImg = "INSERT INTO imagenes_productos (producto_id, nombre_archivo, ruta) VALUES ?";
                db.query(sqlImg, [imagenesValores], () => {
                   fetchAndSendProduct();
                });
            });
        } else {
            fetchAndSendProduct();
        }

        function fetchAndSendProduct() {
            db.query(sqlGet, [id], (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                const row = results[0];
                if (row) {
                    row.imagenes = typeof row.imagenes === 'string' ? JSON.parse(row.imagenes) : row.imagenes;
                }
                res.json({ mensaje: "Producto actualizado con éxito", producto: row });
            });
        }
    });
});

app.delete('/api/productos/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM productos WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        // Gracias a ON DELETE CASCADE en la FK de imagenes_productos, 
        // las imágenes asociadas se borrarán de la base de datos automáticamente.
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Producto no encontrado" });
        res.json({ mensaje: "Producto eliminado con éxito" });
    });
});

// Inicia el servidor en el puerto 3000
// listen es un método de Express que inicia el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


