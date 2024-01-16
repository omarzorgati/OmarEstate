import Listing from "../models/listing.model.js";
import { errorHandler } from "../utilities/errors.js";


export const createListing =async(req,res,next)=>{
    try {
        //create is a method
        const listing = await Listing.create(req.body);
        //return the listing and send it back
        res.status(201).json(listing)
        
    } catch (error) {
        next(error);
    
        
    }

}
export const deleteListing =async(req,res,next)=>{
  const listing = await Listing.findById(req.params.id);
  if(!listing) return next(errorHandler(404,'Listing not found'));
  //check if user.id is the same as the listing.userref
  if(req.user.id !== listing.userRef) return next(errorHandler(401,'You can only delete ur own listings'));
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted');
  } catch (error) {
    next(error);
  }

}

export const updateListing =async(req,res,next)=>{
    const listing = await Listing.findById(req.params.id);
    if(!listing) return next(errorHandler(404,'Listing not found'))
    if(req.user.id !== listing.userRef) return next(errorHandler(401,'You can only update ur own listings'));
    try {
      const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
        );
        res.status(200).json(updatedListing);
    } catch (error) {
      next(error);
    }
}
export const getListing =async(req,res,next)=>{
try {
  const listing = await Listing.findById(req.params.id);
  if(!listing) return next(errorHandler(404,'Listing not found'));
  res.status(200).json(listing);
} catch (error) {
  next(error);
}
};

export const getListings =async(req,res,next)=>{
  try {
  //query after writing the link : api/listings?page=1&limit=10
  //if there a limit use parse it and make a number otherwise use 9
  //limit: how many results do u want
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;
    //if it is false or undefind search in database both true or false
    if(offer === 'false' || offer === undefined){
      offer = {$in:[false,true]};
    }
    let furnished = req.query.furnished;
    if(furnished === 'false' || furnished === undefined){
      furnished = {$in:[false,true]};
    }
    let parking = req.query.parking;
    if(parking === 'false' || parking === undefined){
      parking = {$in:[false,true]};
     }
     let type = req.query.type;
     if(type === undefined || type === 'all' ){
      type = {$in:['rent','sale']};
     }
     const searchTerm = req.query.searchTerm || '';
     const sort = req.query.sort || 'createdAt';
     const order = req.query.order || 'desc';
     //$regex  is an operator used in queries to perform regular expression pattern matching
     //$options:'i' dont care about upper or lower case
     const listings = await Listing.find({
        name :{$regex:searchTerm,$options:'i'},
        offer,
        furnished,
        parking,
        type,
     }).sort(
      {[sort]:order}
     ).limit(limit).skip(startIndex);
    return res.status(200).json(listings);
    
  } catch (error) {
      next(error);
  }
}