'use client'

import Hero from '@/src/components/Hero';
import Features from '@/src/components/Features';
import HowItWorks from '@/src/components/HowItWorks';
import Developers from '@/src/components/Developers';
import ContactModule from '@/src/components/ContactModule'; // NEW COMPONENT

const HomePage = () => {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Developers />
      <ContactModule /> 
    </>
  );
};

export default HomePage;