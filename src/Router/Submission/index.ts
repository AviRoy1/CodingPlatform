import Testcase from "../../model/TestCase";
import express from 'express';
import joi, { compile } from 'joi';
import dotenv from 'dotenv';
import axios from 'axios';
import { getErrorMessage } from '../../utils/joi.util';
import verifytoken from "../../middleware/verifyToken";
import User from "../../model/User";
import Question from "../../model/Questions";


dotenv.config();
const router = express.Router();

//  function to convert the source code to string using \n
function replaceLineBreaks(code: string): string {
    const lineBreakSequence = '{LINE_BREAK}';
    const lineBreakCharacter = '\n';
  
    const updatedCode = code.replace(new RegExp(lineBreakSequence, 'g'), lineBreakCharacter);
  
    return updatedCode;
}

//  Submit code
const submissionSchema = joi.object().keys({
    problemId: joi.number().required(),
    compilerId:  joi.number().required(),
    source: joi.any().required(),
    test: joi.string(),
})
router.post(
    '/submit',
    verifytoken,
    async (req, res, next) => {
        try {
          req.body = await submissionSchema.validateAsync(req.body);
          next();
        } catch (error) {
          return res.status(422).json({ message: getErrorMessage(error) });
        }
    },
    async (req: any,res) => {
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(400).json({message: "You have to login to make submission"});
        }
        // const sourcecode = replaceLineBreaks(req.body.source);
        var submissionData = {
            problemId: req.body.problemId,
            compilerId: req.body.compilerId,
            source: req.body.source
        };

        try {
            axios
            .post(`https://8dda95cd.problems.sphere-engine.com/api/v4/submissions?access_token=${process.env.access_token_problem}`
                    ,submissionData )
            .then(async(response) => {
              console.log(response.data); // problem data in JSON
              if (response.status === 201) {
                return res.status(200).json({message: `Problem submitted successfully and Submission id - ${response.data.id}`});
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

    }   
)


export default router;
