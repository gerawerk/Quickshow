import React, { useState } from 'react'
import BlurCircle from './BlurCircle';
import { ChevronDown, ChevronLeft, ChevronLeftIcon, ChevronsRight, ChevronsRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const DateSelect = ({dateTime,id}) => {

  const navigate = useNavigate();
const [selected, setSelected] = useState(null);

const onBookHandler = () => {
  if (!selected) {
   toast.error('Please select a date to proceed with booking.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'text-sm font-medium',
      });
      return;
  }
  navigate(`/movies/${id}/${selected}`);
  scrollTo(0, 0);
};
return (
  <div id="dateselect" className="pt-30 mt-36">
    <div className="flex flex-col md:flex-row items-center justify-between gap-18 relative p-8 bg-primary/10 border border-primary/20 rounded-lg">
      <BlurCircle top="-100px" right="-100px" />
      <div className="flex items-center gap-6 text-sm mt-5">
      <p className="text-lg font-semibold">Choose Date</p>
        <ChevronLeft width={28}/>
        <span className="grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4">
  {Object.keys(dateTime).map((date) => (
    <button  onClick={()=>setSelected(date)} key={date} className= {`flex flex-col items-center justify-center h-14 w-14 
    aspect-square rounded cursor-pointer ${selected===date? "bg-primary text-white":"border border-primary/70"} `}>
      <span>{new Date(date).getDate()}</span>
      <span>{new Date(date).toLocaleDateString("en-US", { month: "short" })}</span>
    </button>
  ))}
   </span>
   <ChevronsRight width={28}/>

      </div>
        <button onClick={onBookHandler} className="bg-primary text-white px-8 py-2 mt-6 rounded
     hover:bg-primary/90 transition-all cursor-pointer">Book Now
     </button>
    </div>
  
  </div>
);
}

export default DateSelect
