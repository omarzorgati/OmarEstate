import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utilities/errors.js";
import Listing from "../models/listing.model.js";
export const test = (req,res)=> {
    res.json({
        message:'hello world',
    });
};

export const updateUser = async(req,res,next)=> {
    // if the id is not equal the to id of in the parametre /updateuser/:id
    if(req.user.id !== req.params.id ) return next(errorHandler(401,'You can only update ur own account'))
    //if the user is correct we want to update the user
    try {
      // we need to hash the new password
      if (req.body.password) {
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
      }
      // update the user
      const updatedUser = await User.findByIdAndUpdate(req.params.id,{
        // if user wanted to change only the password we need to allow that by using set to check.
        $set:{
            username : req.body.username,
            email : req.body.email,
            password : req.body.password,
            avatar : req.body.avatar,
        } // new true is going to return and save this updated user with the new informations
      }, {new:true})
      //now we neeed to seperate the password from the rest
      const {password,...rest} = updatedUser._doc;
      res.status(200).json(rest);
           

    } catch (error) {
        next(error)
    }
    
// to test all of this in postman u must sign in first and after update stupid information :&&
}

export const deleteUser = async(req,res,next)=> {
    if(req.user.id !== req.params.id ) return next(errorHandler(401,'You can only delete ur own account'))
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token')
        res.status(200).json('User has been deleted');
    } catch (error) {
        next(error)
    }

}
export const getUserListing = async(req,res,next)=> {
if(req.user.id === req.params.id ) {
    try {
       const listings = await Listing.find({userRef: req.params.id});
       res.status(200).json(listings);   
    } catch (error) {
     next(error) 
    }

}else{
    next(errorHandler(401,'You can only view ur own listings'));
}
}

export const getUser = async(req,res,next)=> {
    try {
        const user = await User.findById(req.params.id);
    
        if(!user) return next(errorHandler(404,'User not found'));
        const {password:pass,...rest} = user._doc;
        res.status(200).json(rest); 
        
    } catch (error) {
        next(error)
    }
    
       }