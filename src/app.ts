import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import helmet from 'helmet';
import httpStatus from "http-status";
import mongoSanitize from "express-mongo-sanitize";
import ApiError from './utils';
import { errorConverter } from './middleware/error';
import allApis from './Router/index'




dotenv.config();
const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// // set security HTTP headers
// app.use(helmet());

// // sanitize request data
// app.use(mongoSanitize());

app.use('/api', allApis);

// send back a 404 error for any unknown api request
// app.use((_req, _res, next) => {
//     next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
// });

// convert error to ApiError, if needed
app.use(errorConverter);

app.listen(process.env.port, () => {
    console.log(`Listening to port ${process.env.port}`);
});

