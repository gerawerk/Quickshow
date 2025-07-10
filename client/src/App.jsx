import React from 'react'
import Navbar  from './components/Navbar'
import Home from './pages/Home' 
import Movies from './pages/Movies'
import Favorite from './pages/Favorite'
import MyBooking from './pages/MyBooking'
import SeatLayout from './pages/SeatLayout'
import MovieDetail from './pages/MovieDetail'
import { Route,Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import {Toaster} from 'react-hot-toast'
import './index.css';

import Dashbourd from './pages/admin/Dashbourd'
import ListBookings from './pages/admin/ListBookings'
import ListShows from './pages/admin/ListShows'
import AddShows from './pages/admin/AddShows'
import Layout from './pages/admin/Layout'
const App = () => {
      const isAdminRoute= useLocation().pathname.startsWith('/Admin')

  return (
    <>
    <Toaster/>
{ !isAdminRoute && <Navbar/>}      
     <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/movies' element={<Movies/>}/>
         <Route path="/movies/:id" element={<MovieDetail />} />
         <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route path='/my-bookings' element={<MyBooking/>}/>
        <Route path='/favorite' element={<Favorite/>}/>
        <Route path='/admin/*' element={<Layout/>}>
           <Route index element={<Dashbourd/>}/>
           <Route path='list-bookings' element={<ListBookings/>}/>
           <Route path='list-shows' element={<ListShows/>}/>
           <Route path='add-shows' element={<AddShows/>}/>
        </Route>
      </Routes>
      
{ !isAdminRoute && <Footer/>}      

    </>
  )
}

export default App
