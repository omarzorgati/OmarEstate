import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    username : {
        type:String ,
        required: true,
        unique: true,
    },
    email : {
        type:String ,
        required: true,
        unique: true,
    },
    password : {
        type:String ,
        required: true,
    },
    avatar : {
        type:String ,
        default:"https://cdn2.iconfinder.com/data/icons/instagram-outline/19/11-512.png"
    },

// to know when the user is created or updated
}, {timestamps:true})

const User = mongoose.model('User', userSchema);
export default User;
