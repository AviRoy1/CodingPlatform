import express from 'express';
import userRouter from '../Router/Auth/index';

const router = express.Router();

router.use('/user', userRouter);

export default router;