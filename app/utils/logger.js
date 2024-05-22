const path = require('path'); // Módulo para manejar y transformar rutas de archivos
const fs = require('fs'); // Módulo del sistema de archivos para operaciones como la escritura de logs
const { app } = require('electron'); // Módulo de Electron para acceder a propiedades de la aplicación

// Ruta de la carpeta de logs
const userDataPath = app.getPath('userData');
const logDirectory = path.join(userDataPath, 'logs');

// Obtiene la fecha actual para nombrar el archivo de log
const currentDate = new Date();
const dateString = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
const logFileName = `[${dateString}] Log.txt`;
const logFilePath = path.join(logDirectory, logFileName);

// Crea la carpeta de logs si no existe
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
  }

// Abre el archivo de log en modo de escritura, creando uno nuevo si no existe
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// Función para registrar logs con fecha y hora en el archivo de log
const logToFile = (message) => {
  const timestamp = new Date().toLocaleString();
  logStream.write(`${timestamp}: ${message}\n`);
};

module.exports = logToFile;
