import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { SearchIcon, MenuIcon, XIcon, TicketPlus } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
  const { favoriteMovies } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  const handleLinkClick = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur border-b border-white/10 text-white">
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
        {/* Logo */}
        <Link to="/">
          <img src={assets.logo} alt="logo" className="w-36 h-auto" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 font-medium text-lg">
          <Link to="/">Home</Link>
          <Link to="/movies">Movies</Link>
          <Link to="/theaters">Theaters</Link>
          <Link to="/releases">Releases</Link>
          {favoriteMovies?.length > 0 && <Link to="/favorite">Favorites</Link>}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <SearchIcon className="hidden md:block w-6 h-6 cursor-pointer" />
          {!user ? (
            <button
              onClick={openSignIn}
              className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium"
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

        {/* Mobile Menu Toggle */}
        <div className="md:hidden z-50">
          {isOpen ? (
            <XIcon
              className="w-6 h-6 cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          ) : (
            <MenuIcon
              className="w-6 h-6 cursor-pointer"
              onClick={() => setIsOpen(true)}
            />
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full h-full bg-black/90 backdrop-blur transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 text-xl font-semibold">
          <Link onClick={handleLinkClick} to="/">Home</Link>
          <Link onClick={handleLinkClick} to="/movies">Movies</Link>
          <Link onClick={handleLinkClick} to="/theaters">Theaters</Link>
          <Link onClick={handleLinkClick} to="/releases">Releases</Link>
          {favoriteMovies?.length > 0 && (
            <Link onClick={handleLinkClick} to="/favorite">Favorites</Link>
          )}
          {!user && (
            <button
              onClick={() => {
                handleLinkClick();
                openSignIn();
              }}
              className="px-6 py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
