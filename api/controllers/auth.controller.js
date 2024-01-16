import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utilities/errors.js";
import jwt from "jsonwebtoken";
// to use the fonction that we created in index.js we add next 
export const signup =async(req,res,next)=>{

    const{username,email,password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password,10);
    const newUser = new User({username,email,password:hashedPassword});
   // try: if there is an error we want to know :
   try{
    await newUser.save();
    res.status(201).json({message:"User created successfully"});
   } catch(error){
    next(error);
   }

};
//sign in 
export const signin = async(req,res,next)=>{
    const {email,password} = req.body;
    try {
        const validUser = await User.findOne({email});
        if(!validUser) return next(errorHandler(404,'user not found'));
        const validPassword = bcryptjs.compareSync(password,validUser.password);
        if(!validPassword) return next(errorHandler(401,'wrong cridential !'));
        //create a token
        const token = jwt.sign({id:validUser._id}, process.env.JWT_SECRET,);
        //we dont want the password the show up we need to remoove it: distract password from the informations of the user
        const {password:pass,...rest} = validUser._doc;
        // save the token as a coockie
        res.cookie('access_token',token,{httpOnly:true})
        .status(200)
        //convert the rest to json
        .json(rest);

        
    } catch (error) {
        next(error);
    }
}
//google
export const google = async(req,res,next)=>{
    try {
        const user = await User.findOne({email:req.body.email});
        if(user) {
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
            const {password,...rest} = user._doc;
        res
        .cookie('access_token',token,{httpOnly:true})
        .status(200)
        .json(rest); 
        }else {
            //we need to generate a random password for creating a user with google
            const generatedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword,10);
            //create a new user:we must convert the username to lower case and add it numbers to be unique 
            const newUser = new User({username:req.body.name.split(" ").join("").toLowerCase() +
            Math.random().toString(36).slice(-4) ,email:req.body.email,password:hashedPassword,
            avatar: req.body.photo})
            await newUser.save();
            const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET);
            const {password,...rest} = newUser._doc;
            res
            .cookie('access_token',token,{httpOnly:true})
            .status(200)
            .json(rest); 

        }
       
        
    } catch (error) {
        next(error)
        
    }
}
export const signout = async(req,res,next)=>{

try {
    res.clearCookie('access_token');
    res.status(200).json('User has been signed out');
} catch (error) {
    next(error)
}
}