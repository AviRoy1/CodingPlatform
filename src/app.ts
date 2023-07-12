import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database';



dotenv.config();
const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(process.env.port, () => {
    console.log(`Listening to port ${process.env.port}`);
});

