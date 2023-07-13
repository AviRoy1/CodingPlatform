import express from 'express';
import userRouter from '../Router/Auth/index';
import problemRouter from '../Router/Problem/index';
import testcaseRouter from '../Router/TestCase/index';
import submissionRoute from '../Router/Submission/index';

const router = express.Router();

router.use('/user', userRouter);
router.use('/problem', problemRouter);
router.use('/testcase', testcaseRouter);
router.use('/submission', submissionRoute);


export default router;