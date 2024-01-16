import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import ListingCart from '../Components/ListingCart';




export default function Search() {
    const navigate = useNavigate();
    const [showMore,setShowMore]=useState(false);
    const [sidebardata, setSideBarData] =useState({
        searchTerm:'',
        type:'all',
        parking:false,
        furnished:false,
        offer:false,
        sort:'createdAt',
        order:'desc',
    });
    //console.log(sidebardata);
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    //console.log(listings);

    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');
        if (
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
            ){
            setSideBarData({
                searchTerm:searchTermFromUrl || '',
                type:typeFromUrl || 'all',
                parking:parkingFromUrl === 'true' ? true : false,
                furnished:furnishedFromUrl === 'true' ? true : false,
                offer:offerFromUrl === 'true' ? true : false,
                sort:sortFromUrl || 'createdAt',
                order:orderFromUrl || 'desc',
            })
            };
            //fetch the data
            const fetchListings=async()=>{
                setLoading(true);
                setShowMore(false);
                const searchQuery = urlParams.toString();
                const res = await fetch (`/api/listing/get?${searchQuery}`);
                const data = await res.json();
                //adding the showmore if there is more than 9 listings
                if(data.length>8){
                    setShowMore(true);
                }else{
                    setShowMore(false)
                }
                setListings(data);
                setLoading(false);

            };
            fetchListings();
            
            },[location.search])
    const handleChange=(e)=>{
        if (e.target.id==='all'|| e.target.id==='rent'|| e.target.id==='sale'){
            setSideBarData({
                ...sidebardata,
                type:e.target.id
            })
        }
        if (e.target.id ==='searchTerm'){
            setSideBarData({
                ...sidebardata,
                searchTerm:e.target.value
            })
        }
         //we neeed to add a condition because it s not always a boolean it might be string cz we are getting the informations from the url   
        if (e.target.id==='parking'|| e.target.id==='furnished'|| e.target.id==='offer'){
            setSideBarData({
                ...sidebardata,
                //i can be : true or 'true':string so we convert it to true
                [e.target.id] : e.target.checked || e.target.checked === 'true' ? true : false
            })

    }

    if (e.target.id==='sort_order'){
        //we need to split them 
        const sort = e.target.value.split('_')[0] || 'createdAt';
        const order = e.target.value.split('_')[1] || 'desc';
        setSideBarData({...sidebardata,sort,order})
    }
}

const handleSubmit =(e)=>{
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);

}
const onShowMoreClick=async()=>{
    const numberOfListings = listings.length;
    const startIndex = numberOfListings ;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if(data.length<9){
        setShowMore(false);
    }
    setListings([...listings,...data]);
}
  return (
    <div className='flex flex-col md:flex-row' >
     <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
            <div className="flex items-center gap-2 border-b-2 md:border-r-2 ">
                <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                <input type="text"
                id='searchTerm'
                placeholder='Search...'
                className='border rounded-lg p-3 w-full' 
                value={sidebardata.searchTerm}
                onChange={handleChange}/>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
                <label className='font-semibold'>Type :</label>
                <div className="flex gap-2">
                    <input type="checkbox" id="all" className='w-5' 
                    checked={sidebardata.type === "all"}
                    onChange={handleChange}/>
                    <span>Rent & Sale</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id="rent" className='w-5' 
                    checked={sidebardata.type === "rent"}
                    onChange={handleChange}/>
                    <span>Rent</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id="sale" className='w-5' 
                     checked={sidebardata.type === "sale"}
                     onChange={handleChange}/>
                    <span>Sale</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id="offer" className='w-5' 
                    checked={sidebardata.offer}
                    onChange={handleChange}/>
                    <span>Offer</span>
                </div>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
                <label className='font-semibold'>Amenities :</label>
                <div className="flex gap-2">
                    <input type="checkbox" id="parking" className='w-5' 
                    checked={sidebardata.parking}
                    onChange={handleChange}/>
                    <span>Parking</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id="furnished" className='w-5' 
                    checked={sidebardata.furnished}
                    onChange={handleChange}/>
                    <span>Furnished</span>
                </div>
            
            </div>
            <div className="flex items-center gap-2">
                <label className='font-semibold'>Sort :</label>
                <select onChange={handleChange} id='sort_order' className='border rounded-lg p-2'
                defaultValue={'createdAt_desc'}>
                    <option value='regularPrice_desc' >Price high to low</option>
                    <option value='regularPrice_asc'>Price low to high</option>
                    <option value='createdAt_desc'>latest</option>
                    <option value='createdAt_asc'>oldest</option>
                </select>
            </div>
                <button className='bg-blue-500 text-white p-2 rounded-lg uppercase hover:opacity-95'>
                Search
                </button>
        </form>
     </div>
     <div className='flex-1' >
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">Listing Results</h1>
        <div className="p-7 flex flex-wrap gap-4">
            {!loading && listings.length === 0 && (
                <p className='text-xl text-slate-700' >No Listing Found!</p>
            )}
            {loading &&(
                <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>
            )}
            {!loading && listings && listings.map((listing)=>(
                <ListingCart key={listing._id} listing={listing} />

            ))}
            {showMore && ( 
                <button onClick={onShowMoreClick} className='text-green-700 hover:underline p-7 text-center w-full' 
                >Show More</button>
            )}
        </div>
     </div>
    </div>
  )
}
