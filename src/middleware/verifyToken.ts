import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifytoken = (req:any, res:any, next:any) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader;
    jwt.verify(token, process.env.JWT_SECRETS || "aabc", (err:any, user:any) => {
      if (err) return res.status(400).json("Some error occured");
      req.user = user;
      next();
    });
  } else {
    return res.status(400).json("Access token is not valid");
  }
};

export default verifytoken;
