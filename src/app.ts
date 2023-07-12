import express from 'express';
import dotenv from 'dotenv';


dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(process.env.port, () => {
    console.log(`Listening to port ${process.env.port}`);
});

