import { useDispatch, useSelector } from 'react-redux';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInStart,signInSuccess,signInFailure } from '../redux/user/userSlice.js';
import OAuth from '../Components/oAuth.jsx';
export default function SignIn() {
  const [formData,setFormData]=useState({});
  //after the redux we can make it like this:
  //const [error,setErorr]=useState(null);
 // const [loading,setLoading]=useState(false);
 //get the loading and the error from the user.slice redux
 const {loading,error}= useSelector((state)=>state.user)
  const navigate = useNavigate();
  //redux
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData(
      {
        ...formData,
        [e.target.id]:e.target.value
      }
    );
  };
    const handleSubmit = async(e) => {
      e.preventDefault();
      try {
        //setLoading(true); after the redux we can make it like this:
        dispatch(signInStart());
        //vite.config.js for adding proxy
        const res = await fetch('/api/auth/signin',
        {
          method : 'POST',
          //converting the data to json
          headers : {
            'Content-Type' : 'application/json'
          },
          //sending the formData
          body : JSON.stringify(formData)
        });
        const data = await res.json();
        //handling the errors (index.js we created the error function)
        if(data.success === false)
        {
          //after the redux we can make it like this:
          //setErorr(data.error);
          //setLoading(false);
          dispatch(signInFailure(data.message));
          return;
        }
        //after the redux we can make it like this:
        //setLoading(false);
        //setErorr(null);
        dispatch(signInSuccess(data));
        // if it s true go to sign in page
        navigate('/');
        console.log(data);
        
      } catch (error) {
        //same here
        //setLoading(false);
        //setErorr(error.message);
        dispatch(signInFailure(error.message));
        
      }
     
    };
  return (
    <div className='p-3 max-w-lg mx-auto'>
     <h1 className='text-3xl text-center font-semibold my-7' >Sign In</h1>
     <form  onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <input type='text' placeholder='email' className='border p-3 rounded-lg' id='email'
      onChange={handleChange} />
      <input type='password' placeholder='password' className='border p-3 rounded-lg' id='password'
      onChange={handleChange} />
      <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80' >
        {loading ? 'loading...' : 'Sign In'}  </button>
        <OAuth/>
     </form>
     <div className='flex gap-2 mt-5' >
     <p>Dont have an account?</p>
      <Link to="/sign-up">
        <span className='text-blue-700' >Sign Up</span>
      </Link>
     </div>
     {error && <p className='text-red-500' >{error}</p> }
    </div>
  )
}
 