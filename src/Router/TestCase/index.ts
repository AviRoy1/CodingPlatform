import Testcase from "../../model/TestCase";
import express from 'express';
import joi from 'joi';
import dotenv from 'dotenv';
import axios from 'axios';
import { getErrorMessage } from '../../utils/joi.util';
import verifytoken from "../../middleware/verifyToken";
import User from "../../model/User";


dotenv.config();

const router = express.Router();

//  Add testcase
const addTestcaseSchema = joi.object().keys({
    input: joi.string().required(),
    output: joi.string().required(),
    problemId: joi.number().required(),
    timelimit : joi.number(),
    masterjudgeId: joi.number().required(),
});

router.post(
    '/add',
    verifytoken,
    async (req, res, next) => {
      try {
        req.body = await addTestcaseSchema.validateAsync(req.body);
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
      
        var testcaseData  = {
          input: req.body.input,
          output: req.body.output,
          judgeId: req.body.masterjudgeId,
          timelimit: req.body?.timelimit,
        };
        try {
            var result: any ;          
            axios
            .post(`https://8dda95cd.problems.sphere-engine.com/api/v4/problems/${req.body.problemId}/testcases?access_token=${process.env.access_token_problem}`
                    ,testcaseData )
            .then(async(response) => {
              console.log(response.data); // problem data in JSON
              if (response.status === 201) {
                const newtestcase=await Testcase.create({
                    number: response.data.number,
                    input: req.body.input,
                    output: req.body.output,
                    problemId: req.body.problemId,
                    timelimit: req.body?.timelimit,
                    masterjudgeId: req.body.masterjudgeId,
                })
                return res.status(200).json({message: "Problem creates successfully",data: newtestcase});
              } 
              else {
                if (response.status === 401) {
                    console.log('Invalid access token');
                } else if (response.status === 403) {
                    console.log('Access denied');
                } else if (response.status === 404) {
                    console.log('Problem does not exist');
                } 
            }
            })   
            
        } catch (error) {
          console.log('Connection problem');
          return res.status(500).json({ message: error });
        }
      });



      //  Update testcase
const updateTCSchema = joi.object().keys({
    input: joi.string(),
    output: joi.string(),
    problemId: joi.number().required(),
    number: joi.number().required(),
    timelimit : joi.number(),
    masterjudgeId: joi.number(),
});

router.put(
    '/update',
    verifytoken,
    async (req, res, next) => {
      try {
        req.body = await updateTCSchema.validateAsync(req.body);
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
      
        var testcaseData  = {
          input: req.body?.input,
          output: req.body?.output,
          judgeId: req.body?.masterjudgeId,
          timelimit: req.body?.timelimit,
        };
        try {
            var result: any ;          
            axios
            .put(`https://8dda95cd.problems.sphere-engine.com/api/v4/problems/${req.body.problemId}/testcases/${req.body.number}?access_token=${process.env.access_token_problem}`
                    ,testcaseData )
            .then(async(response) => {
              console.log(response.data); // problem data in JSON
              if (response.status === 200) {
                const newtestcase=await Testcase.findOne({number: req.body.number});
                if(newtestcase === null){
                    return res.status(200).json({message: "Testcase no exist"});
                    }
                newtestcase.input = req.body?.input;
                newtestcase.output = req.body?.output;
                newtestcase.timelimit = req.body?.timelimit;

                return res.status(200).json({message: "Problem creates successfully",data: newtestcase});
              } 
              else {
                if (response.status === 401) {
                    console.log('Invalid access token');
                } else if (response.status === 403) {
                    console.log('Access denied');
                } else if (response.status === 404) {
                    console.log('Problem does not exist');
                } 
            }
            })   
            
        } catch (error) {
          console.log('Connection problem');
          return res.status(500).json({ message: error });
        }
      });



export default router;
