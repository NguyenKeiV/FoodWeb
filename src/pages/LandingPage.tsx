import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Products from "../components/Product";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import ChatAssistant from "../components/ChatAssistant";
const LandingPage: React.FC = () => {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-emerald-800 via-teal-600 to-emerald-900">
      <Header />
      <Hero />

    </main>
  );
};

export default LandingPage;
{/* <img
        className="absolute top-0 right-0 w-full h-full "
        src="/image/Terminal.jpg"
        alt=""
      /> */}