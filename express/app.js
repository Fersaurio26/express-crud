const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 2000;

const url = 'mongodb://localhost:27017';
const dbName = 'informacion';

let db;

async function connectToDatabase() {
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log('Conectado correctamente a MongoDB');
    db = client.db(dbName);
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
  }
}

connectToDatabase();

app.get('/', (req, res) => {
  res.send('Prueba de que agarra express y node');
});

app.get('/contactos', async (req, res) => {
  try {
    const contactos = await db.collection('contactos').find({}).toArray();
    res.json(contactos);
  } catch (error) {
    console.error('Error al recuperar contactos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});

process.on('SIGINT', async () => {
  try {
    await db.client.close();
    console.log('Conexión con MongoDB cerrada');
    process.exit(0);
  } catch (error) {
    console.error('Error al cerrar la conexión con MongoDB:', error);
    process.exit(1);
  }
});
