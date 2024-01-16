import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {Swiper,SwiperSlide} from "swiper/react";
import SwiperCore from "swiper";
import{Navigation} from 'swiper/modules';
import 'swiper/css/bundle';
import ListingCart from '../Components/ListingCart';





export default function Home() {
  const [offerListings,setOfferListings]=useState([]);
  const [saleListings,setSaleListings]=useState([]);
  const [rentListings,setRentListings]=useState([]);
  //console.log(offerListings);
  SwiperCore.use([Navigation]);

  useEffect(()=>{
    const fetchOfferListings=async()=>{
      try {
        const res = await fetch('api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        //we call the fonction here:
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    }
    const fetchRentListings=async()=>{
      try {
        const res = await fetch('api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        //we call the sale fonction here too : 
        fetchSaleListings();
        
      } catch (error) {
        console.log(error);
      }
      }
      const fetchSaleListings=async()=>{
        try {
          const res = await fetch('api/listing/get?type=sale&limit=4');
          const data = await res.json();
          setSaleListings(data);
          //we call the sale fonction here too :          
        } catch (error) {
          console.log(error);
        }
        }
    fetchOfferListings();
  },[])

  return (
    <div>
      {/* top*/}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className='text-slate-700 font-semibold text-3xl lg:text-6xl '>
          Find your next <span className='text-slate-500'>perfect</span>
          <br/> place with ease
        </h1>
        <div className="text-gray-500 text-xs sm:text-sm">
          Omar Estate will help you find your home fast, easy and comfortable.
          <br/> We have a wide range of propreties for you to choose from.
        </div>
        <Link to={'/search'} className='text-xs sm:text-sm text-blue-800 font-semibold hover:underline'>
          Start Now... </Link>
      </div>
      <Swiper navigation >

      {/* swiper*/}

      {
        offerListings && offerListings.length>0 &&
        offerListings.map((listing)=>(
        <SwiperSlide key={listing._id} >
          <div className="h-[500px]" style={{background:`url(${listing.imageURLs[0]}) center no-repeat`, backgroundSize:"cover"}} >

          </div>
        </SwiperSlide>  
        ))
      }
    </Swiper>
        {/* listing results*/}
        <div className="max-w-6xl mx-auto flex flex-col gap-8 my-10">
          {
            offerListings && offerListings.length>0 &&(
              <div className="">
              <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
                <Link to={'/search?offer=true'} className='text-sm text-blue-700 font-semibold hover:underline' >
                  Show more offers</Link>
              </div>
                  <div className="flex flex-wrap gap-6">
                    {
                      offerListings.map((listing)=>(
                        <ListingCart listing={listing} key={listing._id} />
                      ))
                    }
                  </div>
            </div>
            )
          }
            {
            rentListings && rentListings.length>0 &&(
              <div className="">
              <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
                <Link to={'/search?type=rent'} className='text-sm text-blue-700 font-semibold hover:underline' >
                  Show more places for rent</Link>
              </div>
                  <div className="flex flex-wrap gap-6">
                    {
                      rentListings.map((listing)=>(
                        <ListingCart listing={listing} key={listing._id} />
                      ))
                    }
                  </div>
            </div>
            )
          }
            {
            saleListings && saleListings.length>0 &&(
              <div className="">
              <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-600'> Recent places for sale</h2>
                <Link to={'/search?type=sale'} className='text-sm text-blue-700 font-semibold hover:underline' >
                  Show more places for sale</Link>
              </div>
                  <div className="flex flex-wrap gap-6">
                    {
                      saleListings.map((listing)=>(
                        <ListingCart listing={listing} key={listing._id} />
                      ))
                    }
                  </div>
            </div>
            )
          }
        </div>
        
      

    </div>
  )
}
