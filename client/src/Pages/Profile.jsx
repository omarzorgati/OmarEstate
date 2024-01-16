import { useRef,useState,useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutUserFailure, signoutUserStart, signoutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from "../redux/user/userSlice.js";
import { Link } from "react-router-dom";



export default function Profile() {
  //firebase storage:
  //allow read;
  //allow write:if
  //request.resource.size < 2 * 1024 * 1024 &&
  //request.resource.contentType.matches('image/.*')
  const {currentUser,loading,error} = useSelector((state) => state.user);
  //we used "useref the make the choose file works inside the image"
  const fileRef = useRef(null);
  //we need to create a state that save the file
  const [file, setFile] = useState(undefined)
  const [filePerc,setFilePerc] = useState(0);
  const [fileUploadError,setFileUploadError]=useState(false);
  const [formData,setFormData]= useState({});
  const dispatch = useDispatch();
  const [updateSuccess,setUpdateSuccess]=useState(false);
  const[showListingsError,setShowListingsError]=useState(false);
  const [userListings,setUserListings]=useState([]);
  //console.log(file)
  //console.log(filePerc)
  //console.log(fileUploadError)
  //console.log(formData)
  //we need to useEffect to see the changes if we see a change we want to upload it
  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  },[file]);
  //all of this is for the file 
  const handleFileUpload = (file) => {
      //create a storage from firebase
    const storage = getStorage(app);
    //we need to make it unique
    const fileName = new Date().getTime() + file.name;
    // create a storage ref showing which place to save the storage
    const storageRef = ref(storage,fileName);
    // we want to see the percentage of the upload
    const uploadTask = uploadBytesResumable(storageRef,file);
    // track the changes
    uploadTask.on('state_changed',
    //snapshot is a piece of changement in each state
    (snapshot) => {
    //record the progress
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    setFilePerc(Math.round(progress));
  },
  (error)=>{
    setFileUploadError(true);
},
//creating a callback function
()=>{
  getDownloadURL(uploadTask.snapshot.ref).then
  //set the file URl to a form data
  ((downloadURL)=> setFormData({...formData,avatar:downloadURL}));
  }
  )
   };
   const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value 
    });
    //console.log(formData)
  }
  const handleSubmit = async(e) => {
    e.preventDefault();
    //we need to use redux
    try {
    dispatch(updateUserStart());
    //we need to add the user id
    const res = await fetch(`/api/user/update/${currentUser._id}`,
    {
    method : 'POST',
    headers : {
      'Content-Type':'application/json',
    },
    body : JSON.stringify(formData)
   });
   const data = await res.json();
   if(data.success === false){
    dispatch(updateUserFailure(data.message));
    return;
   }
   dispatch(updateUserSuccess(data));
   setUpdateSuccess(true);
   //console.log(data);    
    } catch (error) {
    dispatch(updateUserFailure(error.message));  
    }
  };
  const handleDeleteUser = async() => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,
      {
        method : 'DELETE',
       });
       //getting the response
       const data = await res.json();
       if(data.success === false){
        dispatch(updateUserFailure(data.message));
        return;
       }
       dispatch(deleteUserSuccess(data));
        } catch (error) {
        dispatch(deleteUserFailure(error.message));  
        }
      };
      const handleSignOut = async() => {
        try {
        dispatch(signoutUserStart());
        const res = await fetch('/api/auth/signout');
        const data = await res.json();
       if(data.success === false){
        dispatch(signoutUserFailure(data.message));
        return;
       }
      dispatch(signoutUserSuccess(data));
       } catch (error) {
          dispatch(signoutUserFailure(error.message));
        }
        
      }
      const handleShowListings = async() => {
        try {
          setShowListingsError(false);
          const res = await fetch(`/api/user/listings/${currentUser._id}`);
          const data = await res.json();
          if (data.success === false) {
            setShowListingsError(true);
            return;
          }
         setUserListings(data); 
        } catch (error) {

         setShowListingsError(true);
          

        }

      }
      const handleDeleteUserListing =async(listingId)=>{
      try {
        const res = await fetch(`/api/listing/delete/${listingId}`,{
        method : 'DELETE',
        });
        const data = await res.json();
        if(data.success === false){
          console.log(data.message);
          return;
        }
        //if it is deleted we need to update the user listings
        setUserListings((prev)=>prev.filter((listing)=>listing._id !== listingId));      
      } catch (error) {
        console.log(error.message);
      }
      }
  
  return (
    <div className="p-3 max-w-lg mx-auto" >
    <h1 className='text-3xl font-semibold text-center' >Profile</h1>
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} >
      <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*"/>
      <img onClick={()=>fileRef.current.click()} 
      //adding a condition to display the new image
      src={ formData.avatar || currentUser.avatar} alt="profile"className="rounded-full my-7 h-24 w-24 object-cover cursor-pointer self-center mt-2 "/>
      <p className="text-sm self-center" >
        {fileUploadError 
        ? (<span className="text-red-500 " >Error "image must be less than 2 mo" </span>)
        : filePerc > 0 && filePerc < 100 ?
         (<span className="text-slate-700 " >{`Uploading ${filePerc}%`} </span>)
         : filePerc === 100 ?
        (<span className="text-green-700 " >Image Uploaded successfully</span>)
        :(
        "" )
        } 
      </p>
      <input id='username' 
      type="text" 
      placeholder="username" 
      defaultValue={currentUser.username}
      onChange={handleChange}
      className="border p-3 rounded-lg" />
      <input id='email' 
      type="email" 
      placeholder="email" 
      defaultValue={currentUser.email}
      onChange={handleChange}
      className="border p-3 rounded-lg" />
      <input id='password'  
      type="password"
      placeholder="password"
      onChange={handleChange}
      className="border p-3 rounded-lg" />
      <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
      {loading ? 'loading...' : 'update' } </button>
      <Link to={'/create-listing'} className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95 " >
      create listing
      </Link>
    </form>
    <div className="flex justify-between mt-5" >
      <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer hover:underline" >Delete Account </span>
      <span onClick={handleSignOut} className="text-red-700 cursor-pointer hover:underline" >Sign Out </span>
    </div>
    <p className="text-red-700 mt-5" >{error ? error : ''}</p>
    <p className="text-green-700 mt-5" >{updateSuccess ? 'Profile updated successfully' : ''}</p>
    <button onClick={handleShowListings} className="text-green-700 w-full uppercase hover:underline " >
      show listings</button>
    <p className="text-red-700 mt-5" >{showListingsError ? 'Error showing listings' : ''}</p>
    {userListings && userListings.length > 0 && 
      <div className="flex flex-col gap-4">
        <h1 className="text-center text-2xl mt-7 font-semibold" >Your Listings</h1>
    {userListings.map((listing)=>(
      <div key={listing._id} className="flex border rounded-lg p-3 justify-between items-center gap-4"> 
      <Link to={`/listing/${listing._id}`}>
        <img src={listing.imageURLs[0]} alt="listing cover" className="h-16 w-16 object-contain " />
      </Link>
      <Link to={`/listing/${listing._id}`} className="text-slate-700 font-semibold flex-1 hover:underline truncate">
        <p>{listing.name}</p>
      </Link>
        <div className="flex flex-col gap-3 item-center">
          <button onClick={()=>handleDeleteUserListing(listing._id)} className="text-red-700 uppercase hover:underline" >Delete</button>
          <Link to={`/update-listing/${listing._id}`} >
          <button className="text-green-700 uppercase hover:underline ">Edit</button>
          </Link>
        </div>
      </div>
    ))}
      </div>}
    </div>
  )
}
