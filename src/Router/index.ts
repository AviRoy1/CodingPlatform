import express from 'express';
import userRouter from '../Router/Auth/index';
import problemRouter from '../Router/Problem/index';
import testcaseRouter from '../Router/TestCase/index';

const router = express.Router();

router.use('/user', userRouter);
router.use('/problem', problemRouter);
router.use('/testcase', testcaseRouter);


export default router;