import Question from "../../model/Questions";
import express from 'express';
import joi from 'joi';
import dotenv from 'dotenv';
import axios from 'axios';
import { getErrorMessage } from '../../utils/joi.util';
import verifytoken from "../../middleware/verifyToken";
import User from "../../model/User";


dotenv.config();

const router = express.Router();

//  Add Problem
const addProblemSchema = joi.object().keys({
    name: joi.string().required(),
    body: joi.string(),
    masterjudgeId : joi.number().required(),
});

router.post(
    '/add',
    verifytoken,
    async (req, res, next) => {
      try {
        req.body = await addProblemSchema.validateAsync(req.body);
        next();
      } catch (error) {
        return res.status(422).json({ message: getErrorMessage(error) });
      }
    },
    async (req: any, res) => {
        const user = await User.findById(req.user?.id);
        if (!user?.isAdmin) {
          return res.status(400).json({ message: "You are not authorized to perform this operation." });
        }
      
        var problemData = {
          name: req.body.name,
          body: req.body.body,
          masterjudgeId: req.body.masterjudgeId,
 
        };
        try {
            var result: any ;          
            axios
            .post(`https://8dda95cd.problems.sphere-engine.com/api/v4/problems?access_token=${process.env.access_token_problem}`,problemData )
            .then(async(response) => {
              console.log(response.data); // problem data in JSON
              if (response.status === 201) {
                const newproblem=await Question.create({
                    name: req.body.name,
                    problemCode: response.data.code,
                    problemId: response.data.id,
                    body: req.body?.body,
                    masterjudgeId: req.body.masterjudgeId,
                })
                return res.status(200).json({message: "Problem creates successfully",data: newproblem});
              } else if (response.status === 401) {
                console.log('Invalid access token');
                return res.status(401).json({ message: 'Invalid access token' });
              } else if (response.status === 400) {
                const responseBody = response.data;
                console.log(`Error code: ${responseBody.error_code}, details available in the message: ${responseBody.message}`);
                return res.status(400).json({
                  message: `Error code: ${responseBody.error_code}`,
                  details: responseBody.message,
                });
              }
            })   
            
        } catch (error) {
          console.log('Connection problem');
          return res.status(500).json({ message: error });
        }
      });



//  Update Problem
const updateProblemSchema = joi.object().keys({
    name: joi.string(),
    body: joi.string(),
    problemId: joi.number().required(),
    masterjudgeId: joi.number().required(),
});

router.put(
    '/update',
    verifytoken,
    async (req, res, next) => {
      try {
        req.body = await updateProblemSchema.validateAsync(req.body);
        next();
      } catch (error) {
        return res.status(422).json({ message: getErrorMessage(error) });
      }
    },
    async (req: any, res) => {
        const user = await User.findById(req.user?.id);
        if (!user?.isAdmin) {
          return res.status(400).json({ message: "You are not authorized to perform this operation." });
        }
      
        var problemData = {
        //   name: req.body?.name,
          body: req.body?.body,
        };
        try {         
            axios
            .put(`https://8dda95cd.problems.sphere-engine.com/api/v4/problems/${req.body.problemId}?access_token=${process.env.access_token_problem}`,problemData )
            .then(async(response) => {
              console.log(response.status); // problem data in JSON
              if (response.status === 200) {
                const newproblem=await Question.findOne({problemId: req.body.problemId});
                console.log(newproblem);
                if(newproblem === null){
                return res.status(200).json({message: "No problem is exist with this problemId"});
                }
                newproblem.name = req.body?.name;
                newproblem.body = req.body?.body;
                newproblem.masterjudgeId = req.body?.masterjudgeId;
                await newproblem.save();
                return res.status(200).json({message: "Problem creates successfully",data: newproblem});
              } else if (response.status === 401) {
                console.log('Invalid access token');
                return res.status(401).json({ message: 'Invalid access token' });
              } else if (response.status === 400) {
                const responseBody = response.data;
                console.log(`Error code: ${responseBody.error_code}, details available in the message: ${responseBody.message}`);
                return res.status(400).json({
                  message: `Error code: ${responseBody.error_code}`,
                  details: responseBody.message,
                });
              }
            })   
            
        } catch (error) {
          console.log('Connection problem');
          return res.status(500).json({ message: error });
        }
      });
  

//  delete Problem
const deleteProblemSchema = joi.object().keys({
    problemId: joi.number().required(),
});

router.delete(
    '/delete',
    verifytoken,
    async (req, res, next) => {
      try {
        req.body = await deleteProblemSchema.validateAsync(req.body);
        next();
      } catch (error) {
        return res.status(422).json({ message: getErrorMessage(error) });
      }
    },
    async (req: any, res) => {
        const user = await User.findById(req.user?.id);
        if (!user?.isAdmin) {
          return res.status(400).json({ message: "You are not authorized to perform this operation." });
        }

        try {         
            axios
            .delete(`https://8dda95cd.problems.sphere-engine.com/api/v4/problems/${req.body.problemId}?access_token=${process.env.access_token_problem}` )
            .then(async(response) => {
              console.log(response.status); // problem data in JSON
              if (response.status === 200) {
                const newproblem=await Question.findOne({problemId: req.body.problemId});
                await Question.findByIdAndDelete(newproblem?._id);
                return res.status(200).json({message: "Problem successfully deleted"});
              } else {
                if (response.status === 401) {
                    console.log('Invalid access token');
                } else if (response.status === 403) {
                    console.log('Access denied');
                } else if (response.status === 404) {
                    console.log('Problem not found');
                }
            }
            })   
            
        } catch (error) {
          console.log('Connection problem');
          return res.status(500).json({ message: error });
        }
      });
  



export default router;
