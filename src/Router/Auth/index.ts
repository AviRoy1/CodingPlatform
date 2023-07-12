import User from '../../model/User';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt, { compare } from 'bcrypt';
import joi from 'joi';
import dotenv from 'dotenv';
import { getErrorMessage } from '../../utils/joi.util';


dotenv.config();

const router = express.Router();

// User SignUp
const signupSchema = joi.object().keys({
    name: joi.string().required(),
    email: joi.string().trim().email().required(),
    password: joi.string().trim().required(),
});
router.post(
    '/signup',
    async(req,res,next) => {
        try {
            req.body = await signupSchema.validateAsync(req.body);
            next();
        } catch (error) {
            return res.status(422).json({message: getErrorMessage(error)});
        }
    },
    async(req,res) => {
        try {
            const isDuplicateEmail = await User.findOne({email: req.body.email});
            if(isDuplicateEmail) {
                return res.status(400).json({message: "This email has already been registered"})
            }

            // For password encryption
            const salt = await bcrypt.genSalt(10);
            const encryptPass = await bcrypt.hash(req.body.password, salt);

            const newUser = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: encryptPass,
                createdAt: new Date(),
            });

            const accessToken = jwt.sign(
                {
                  id: newUser._id,
                  email: newUser.email,
                },
                process.env.JWT_SECRETS || "aabc",
                {expiresIn: '1d'}
            );

            return res.status(200).json({email: newUser.email, accessToken: accessToken});
        } catch (error) {
            
        }
    }
);


// User Login
const loginSchema = joi.object().keys({
    email: joi.string().trim().email().required(),
    password: joi.string().trim().required(),
});
router.post(
    '/login',
    async(req,res,next) => {
        try {
            req.body = await loginSchema.validateAsync(req.body);
            next();
        } catch (error) {
            return res.status(422).json({message: getErrorMessage(error)});
        }
    },
    async(req,res) => {
        try {
            const user = await User.findOne({email: req.body.email});
            if(!user) {
                return res.status(400).json({message: "Incorrect email or password"})
            }
            
            // password matching
            const comparePassword = await bcrypt.compare(
                req.body.password.toString(),
                user.password.toString(),
            );
            
            if(!comparePassword) {
                return res.status(400).json({message: "Incorrect email or password"});
            }

            const accessToken = jwt.sign(
                {
                  id: user._id,
                  email: user.email,
                },
                process.env.JWT_SECRETS || "aabc",
                {expiresIn: '1d'}
            );

            return res.status(200).json({email: user.email, accessToken: accessToken});
        } catch (error) {
            
        }
    }
)


export default router;

