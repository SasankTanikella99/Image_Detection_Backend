import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import bodyParser from 'body-parser';
import knex from 'knex';

import handleRegister from './controllers/register.js';
import handleSignin from './controllers/signin.js';
import { handleImageDetect, handleApiCall } from './controllers/image.js';
import handleProfile from './controllers/profile.js';

const db = knex({
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      user: 'sasanktanikella',
      password: 'root',
      database: 'image_detection',
    },
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(202).json(database.users);
});

app.post('/signin', (req, res) => {
    handleSignin(req, res, db, bcrypt);
});

app.post('/register', (req, res) => {
    handleRegister(req, res, db, bcrypt);
});

app.get('/profile/:id', (req, res) => {
    handleProfile(req, res, db);
});

app.put('/image', (req, res) => {
    handleImageDetect(req, res, db);
});

app.post('/imageurl', (req, res) => {
    handleApiCall(req, res);
});

app.listen(3080, () => {
    console.log("Server up and running...!");
});
