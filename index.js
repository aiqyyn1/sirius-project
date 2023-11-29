require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./src/routes/router');
const path = require('path')
const app = express();
const port = 8080;
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
