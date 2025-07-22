import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { SearchIcon, MenuIcon, XIcon, TicketPlus } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
    const {favoriteMovies}=useAppContext();
  console.log(favoriteMovies)
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser(); // ✅ fix here
  const { openSignIn } = useClerk(); // ✅ fix here
 const navigate =useNavigate();
  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
      <Link to="/">
        <img src={assets.logo} alt="logo" className="w-36 h-auto" />
      </Link>

      {/* Mobile Menu */}
      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-40 flex flex-col md:flex-row items-center max-md:justify-center gap-8 px-8 py-3 max-md:h-screen rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 transition-[width] duration-300 ${
          isOpen ? 'max-md:w-full' : 'max-md:w-0 max-md:overflow-hidden'
        }`}
      >
        {isOpen && (
          <XIcon
            className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer "
            onClick={() => setIsOpen(!isOpen)}
          />
        )}
        {isOpen && (
          <>
            <Link onClick={() => { window.scrollTo(0, 0); setIsOpen(true); }} to="/">Home</Link>
            <Link onClick={() => { window.scrollTo(0, 0); setIsOpen(true); }} to="/movies">Movies</Link>
            <Link onClick={() => { window.scrollTo(0, 0); setIsOpen(true); }} to="/theaters">Theaters</Link>
            <Link onClick={() => { window.scrollTo(0, 0); setIsOpen(true); }} to="/releases">Releases</Link>
            {favoriteMovies?.length > 0 && <Link onClick={() => { window.scrollTo(0, 0); setIsOpen(true); }} to="/favorite">Favorites</Link>}
          </>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-8 z-10">
        <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer" />
        {!user ? (
          <button
            onClick={() => openSignIn()} // ✅ call the function
            className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
          >
            Login
          </button>
        ) : (
  <UserButton>
  <UserButton.MenuItems>
    <UserButton.Action
      label="My Bookings"
      labelIcon={<TicketPlus width={15} />}
      onClick={() => navigate('/my-bookings')}
    />
  </UserButton.MenuItems>
</UserButton>
        )}
      </div>

      { !isOpen && (
        <MenuIcon
          className="max-md:ml-4 md:hidden w-8 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
      )}
    </div>
  );
};

export default Navbar;
