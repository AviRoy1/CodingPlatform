import express from 'express';
import userRouter from '../Router/Auth/index';
import problemRouter from '../Router/Problem/index';

const router = express.Router();

router.use('/user', userRouter);
router.use('/problem', problemRouter);


export default router;