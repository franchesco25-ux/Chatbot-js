// server.js

const express = require('express');
const mysql = require('mysql2/promise'); // Cambiamos mssql por mysql2/promise
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();

// Middlewares: permiten que nuestro servidor entienda JSON y datos de formularios.
app.use(cors()); // Permite peticiones desde tu frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Configuración de la Base de Datos ---
// ¡Asegúrate de reemplazar estos valores con los de tu SQL Server!
const dbPool = mysql.createPool({
    host: 'localhost',
    user: 'root', // ej: 'root'
    password: '1234',
    database: 'MiProyectoChatbot',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// --- Rutas de la API ---

// Ruta para registrar un nuevo usuario
app.post('/api/register', async (req, res) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await dbPool.query(
            'INSERT INTO Usuarios (NombreUsuario, Email, PasswordHash) VALUES (?, ?, ?)',
            [nombre, email, passwordHash]
        );

        res.status(201).json({ message: 'Usuario registrado con éxito.' });

    } catch (error) {
        console.error(error);
        // Código para violación de constraint UNIQUE en MySQL
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'El nombre de usuario o el email ya existen.' });
        }
        res.status(500).json({ message: 'Error en el servidor al registrar el usuario.' });
    }
});

// Ruta para iniciar sesión
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
    }

    try {
        const [rows] = await dbPool.query('SELECT * FROM Usuarios WHERE Email = ?', [
            email
        ]);

        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas.' }); // Usuario no encontrado
        }

        // Comparar la contraseña enviada con la encriptada en la BD
        const isMatch = await bcrypt.compare(password, user.PasswordHash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' }); // Contraseña incorrecta
        }

        // ¡Login exitoso!
        // Aquí podrías generar un token (JWT) para manejar la sesión.
        res.status(200).json({ message: 'Inicio de sesión exitoso.', userId: user.Id, nombreUsuario: user.NombreUsuario });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor al iniciar sesión.' });
    }
});


// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
