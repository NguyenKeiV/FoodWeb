import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Products from '../components/Product';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import ChatAssistant from '../components/ChatAssistant';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateToFullMenu = () => {
    navigate('/menu');
  };

  return (
    <>
      <Header onNavigate={scrollToSection} />
      <Hero onNavigate={scrollToSection} />
      <About />
      <Products onViewFullMenu={navigateToFullMenu} />
      <CTA />
      <Footer />
      <ChatAssistant />
    </>
  );
};

export default LandingPage;