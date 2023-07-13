import Question from "../../model/Questions";
import express from 'express';
import joi from 'joi';
import dotenv from 'dotenv';
import { getErrorMessage } from '../../utils/joi.util';
import verifytoken from "../../middleware/verifyToken";
import User from "../../model/User";


dotenv.config();

const router = express.Router();

const addProblemSchema = joi.object().keys({
    title: joi.string().required(),
    problemStatement: joi.string().required(),
    difficulty: joi.string().required(),
});
router.post(
    '/add',
    verifytoken,
    async(req,res,next) => {
        try {
            req.body = await addProblemSchema.validateAsync(req.body);
            next();
        } catch (error) {
            return res.status(422).json({message: getErrorMessage(error)});
        }
    },
    async(req: any,res) => {
        const user = await User.findById(req.user?.id);
        if(!user?.isAdmin) {
            return res.status(400).json({message: "You are not authorized to perform this operation."})
        }
        const newProblem = await Question.create({
            title: req.body.title,
            problemStatement: req.body.problemStatement,
            difficulty: req.body.difficulty,
        });
        
    }
)


export default router;
