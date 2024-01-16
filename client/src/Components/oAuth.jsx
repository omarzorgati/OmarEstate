import { useNavigate } from 'react-router-dom';
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';


export default function OAuth() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleGoogleClick = async() =>{
        try {
        //adding google auth
        const provider = new GoogleAuthProvider();
        //getting the auth and passing the app
        const auth = getAuth(app)
        //create the pop-up and sign-up request
        const result = await signInWithPopup(auth,provider);
        const res = await fetch('/api/auth/google',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            //send the data
            body: JSON.stringify({
                name:result.user.displayName,
                email:result.user.email,
                photo:result.user.photoURL}),
        })
        //convert the data to json
        const data = await res.json();
        console.log(data);
        dispatch(signInSuccess(data));
        navigate('/')

            
        } catch (error) {
            console.log("could not sing in with google",error);
            
        }

    }
  return (
        //in order to distract this button from the sumbit function we add another type
        <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95  ' >
        Continue with google </button>
    
  )
}
