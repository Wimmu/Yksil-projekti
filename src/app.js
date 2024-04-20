import express from 'express';
import api from './api/index.js';
import dotenv from 'dotenv';
import cors from 'cors'; // Import cors
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors()); // Use cors middleware

app.use('/api/v1', api);

app.get('/', (req, res) => {
  res.send('Welcome to my REST API!');
});

export default app;
