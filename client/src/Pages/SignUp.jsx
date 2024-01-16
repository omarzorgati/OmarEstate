import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../Components/oAuth';
export default function SignUp() {
  const [formData,setFormData]=useState({});
  const [error,setErorr]=useState(null);
  const [loading,setLoading]=useState(false);
  const navigate = useNavigate();
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
        setLoading(true);
        //vite.config.js for adding proxy
        const res = await fetch('/api/auth/signup',
        {
          method : 'POST',
          //converting the data to json
          headers : {
            'Content-Type' : 'application/json'
          },
          //send the data
          body : JSON.stringify(formData)
        });
        //convert the data to json
        const data = await res.json();
        //handling the errors (index.js we created the error function)
        if(data.success === false)
        {
          setErorr(data.error);
          setLoading(false);
          return;
        }
        setLoading(false);
        setErorr(null);
        // if it s true go to sign in page
        navigate('/sign-in');
        console.log(data);
        
      } catch (error) {
        setLoading(false);
        setErorr(error.message);
        
      }
     
    };
  return (
    <div className='p-3 max-w-lg mx-auto'>
     <h1 className='text-3xl text-center font-semibold my-7' >Sign Up</h1>
     <form  onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <input type='text' placeholder='username' className='border p-3 rounded-lg' id='username'
      onChange={handleChange} />
      <input type='text' placeholder='email' className='border p-3 rounded-lg' id='email'
      onChange={handleChange} />
      <input type='password' placeholder='password' className='border p-3 rounded-lg' id='password'
      onChange={handleChange} />
      <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80' >
        {loading ? 'loading...' : 'Sign Up'}  </button>
        <OAuth/>
     </form>
     <div className='flex gap-2 mt-5' >
     <p>Have an account?</p>
      <Link to="/sign-in">
        <span className='text-blue-700' >Sign In</span>
      </Link>
     </div>
     {error && <p className='text-red-500' >{error}</p> }
    </div>
  )
}
