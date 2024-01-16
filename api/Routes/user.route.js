import express from 'express';
import { deleteUser, getUserListing, test, updateUser,getUser} from '../controllers/user.controller.js';
import { verifyToken } from '../utilities/verifyUser.js';

const router = express.Router();

router.get('/test', test);
// time to create the update route. we added id to know which user we are going to update
router.post('/update/:id',verifyToken,updateUser );
router.delete('/delete/:id',verifyToken,deleteUser );
router.get('/listings/:id',verifyToken,getUserListing );
router.get('/:id',verifyToken,getUser);





export default router;