import React from 'react'
import HeroSection from '../components/HeroSection'
import { useNavigate } from 'react-router-dom'
import FeaturedSection from '../components/FeaturedSection';
import TrailersSection from '../components/TrailersSection';

const Home = () => {
  const navigate =useNavigate();
  return (
    <>
    
      <HeroSection/>
      <FeaturedSection/>
      <TrailersSection/>
    </>
  )
}

export default Home
