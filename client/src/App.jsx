import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import About from './Pages/About'
import Home from './Pages/Home'
import Profile from './Pages/Profile'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import Header from './Components/Header'
import PrivateRoute from './Components/privateRoute'
import CreateListing from './Pages/CreateListing'
import UpdateListings from './Pages/UpdateListings'
import Listing from './Pages/Listing'
import Search from './Pages/Search'


export default function App() {
  return (
    
  
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/about' element={<About />} />
      <Route path='/sign-in' element={<SignIn />} />
      <Route path='/sign-up' element={<SignUp />} />
      <Route path='/listing/:listingId' element={<Listing />} />
      <Route path='/search' element={<Search />} />
      <Route element={<PrivateRoute/>}>
        {/* if there is a currentUser*/}
        <Route path='/profile' element={<Profile />} />
        <Route path='/create-listing' element={<CreateListing />} />
        <Route path='/update-listing/:listingId' element={<UpdateListings />} />



      </Route>


    </Routes>
    </BrowserRouter>
    

  )
}
