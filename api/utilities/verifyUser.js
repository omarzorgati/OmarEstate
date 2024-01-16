// we must verify the user before we can update 
// npm i cookie-parser 
import jwt from "jsonwebtoken";
import { errorHandler } from "../utilities/errors.js";

export const verifyToken = (req, res, next) => {
    //getting the token
    const token = req.cookies.access_token;
    //verify the token
    if (!token) return next(errorHandler(401,'unauthorised'));
    // (err,user) we want to get them
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorHandler(403,'forbidden'));
        //send the data req.user = the user that we are getting from the token
        req.user = user;
        //we add next() to go the next fonction: update the user after veryfying the token
        next();
    }) ; 
       
};
