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
    CREATE TABLE IF NOT EXISTS usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario TEXT NOT NULL,
      password TEXT NOT NULL,
      tipo INTEGER NOT NULL DEFAULT 1
    )`;
  const createCategoryTable = `
  CREATE TABLE IF NOT EXISTS categoria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE
  )`;

  const createProductTable = `
  CREATE TABLE IF NOT EXISTS producto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE ,
    descripcion TEXT NOT NULL,
    categoriaId INTEGER ,
    codigo TEXT UNIQUE,
    unidad TEXT NOT NULL,
    stock REAL ,
    stockMin REAL NOT NULL,
    precioVenta REAL,
    precioCompra REAL ,
    FOREIGN KEY (categoriaId) REFERENCES categoria(id)
  )`;

  const createWalletTable = `
  CREATE TABLE IF NOT EXISTS cartera (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    monto REAL NOT NULL,
    fecha TEXT NOT NULL
  )`;

  const createSalesTable = `
  CREATE TABLE IF NOT EXISTS ventas(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha TEXT NOT NULL,
    monto REAL NOT NULL,
    usuarioId INTEGER NOT NULL,
    FOREIGN KEY (usuarioId) REFERENCES usuario(id)
  )`;

  const createTransactionsTable = `
  CREATE TABLE IF NOT EXISTS transacciones(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productoid INTEGER NOT NULL,
    tipo TEXT NOT NULL,
    motivo TEXT NOT NULL,
    monto REAL NOT NULL,
    fecha TEXT NOT NULL

  )`;

  // const createConfigTable = `
  // CREATE TABLE IF NOT EXIST configuracion(
  //   id INTEGER PRIMARY KEY AUTOINCREMENT,
  // )`;

 
  try {
    await db.run(createUsersTable);
    logToFile('Users table created or already exists');
    await db.run(createCategoryTable);
    logToFile('Category table created or already exists');
    await db.run(createProductTable);
    logToFile('Product table created or already exists');
    await db.run(createWalletTable);
    logToFile('Wallet table created or already exists');
    await db.run(createSalesTable);
    logToFile('Sales table created or already exists');
    await db.run(createTransactionsTable);
    logToFile('Transactions table created or already exists');
  } catch (err) {
    logToFile('Error initializing tables: ' + err);
    console.log(err);
  }
};

module.exports = db; // Exporta la conexión a la base de datos para su uso en otros módulos
