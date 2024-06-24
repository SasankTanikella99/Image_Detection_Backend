import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import bodyParser from 'body-parser';
import knex from 'knex';
import dotenv from 'dotenv'

import handleRegister from './controllers/register.js';
import handleSignin from './controllers/signin.js';
import { handleImageDetect, handleApiCall } from './controllers/image.js';
import handleProfile from './controllers/profile.js';

dotenv.config()

const db = knex({
    client: 'pg',
    connection: {
      ssl: {
        rejectUnauthorized: false // Only if Render requires this
      },
      connectionString:process.env.DATABASE_URL,

      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    },
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());



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

app.listen(process.env.PORT || 3080, () => {
    console.log("Server up and running...!");
});
