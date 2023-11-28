const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./routes/router');
const swaggerjsdoc = require('swagger-jsdoc');
const swagger = require('swagger-ui-express');
const path = require('path')
require('dotenv').config();
const app = express();
const port = 8080;
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sirius api doc',
      version: '0.1',
    },
    servers: [
      {
        url: 'http://localhost:8080/',
      },
    ],
  },
  apis: ['./router.js'],
};
const spacs = swaggerjsdoc(options);
app.use('/api-docs', swagger.serve, swagger.setup(spacs));
app.use(express.json());
app.use(cookieParser());
app.use('/auth', router);
app.use(
  cors({
    credentials: true,
    origin: '*',
  })
);
const uri =
  'mongodb+srv://aiqyyn1:aikyn777@cluster0.j3wfjzi.mongodb.net/?retryWrites=true&w=majority';
  app.use('/Images', express.static(path.join(__dirname, 'Images')));
const start = async () => {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (e) {
    console.error(e);
  }
};

start();
module.exports = app;
