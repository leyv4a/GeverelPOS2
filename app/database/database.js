// Importa las bibliotecas necesarias
const sqlite3 = require('sqlite3').verbose(); // Biblioteca para interactuar con SQLite
const { app } = require('electron'); // Módulo de Electron para acceder a propiedades de la aplicación
const { promisify } = require('util'); // Modulo de Node para promisificar
const path = require('path'); // Módulo para manejar y transformar rutas de archivos
const logToFile = require('../utils/logger') //modulo para el Logger
// Obtiene la ruta del directorio de datos del usuario para la aplicación
const userDataPath = app.getPath('userData');

// Nombre del archivo de la base de datos
const dbFileName = 'database.db';

// Ruta completa del archivo de la base de datos dentro del directorio de datos del usuario
const dbDestinationPath = path.join(userDataPath, dbFileName);

// Conectar a la base de datos
const db = new sqlite3.Database(dbDestinationPath, (err) => {
  if (err) {
    logToFile('Error opening database: ' + err);
  } else {
    logToFile('Database connected at ' + dbDestinationPath);

    // Inicializar tablas
    initializeTables();
  }
});

// Promisificar métodos de la base de datos
db.run = promisify(db.run);
db.get = promisify(db.get);
db.all = promisify(db.all);

// Función para inicializar tablas
const initializeTables = async () => {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT
    )
  `;

 
  try {
    await db.run(createUsersTable);
    logToFile('Users table created or already exists');
  } catch (err) {
    logToFile('Error initializing tables: ' + err);
  }
};

module.exports = db; // Exporta la conexión a la base de datos para su uso en otros módulos
