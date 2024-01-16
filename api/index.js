import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import userRouter from './Routes/user.route.js';
import authRouter from './Routes/auth.route.js';
import listingRouter from './Routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';

//deployment:
const __dirname = path.resolve();

//create server
const app = express();
//allow to use json in the server
app.use(express.json())
//cookie parser
app.use(cookieParser());
app.listen(3001, () => { 
    console.log('Server is running on port 3000');
});
//create database
mongoose.connect(process.env.MONGO).then (()=>{
    console.log('Database connected');
}) .catch((err)=>{
    console.log(err);
})

// define the routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
//it mus be after the api
app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});



//we must create a fonction to handle errors:
app.use((err, req, res, next) => {
    const statusCode= err.statusCode || 500; //500:internal server error
    const message = err.message || 'Internal server error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});