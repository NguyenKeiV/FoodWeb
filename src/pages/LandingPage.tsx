import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Products from "../components/Product";
import ChatAssistant from "../components/ChatAssistant";
import useHorizontalScroll from "../hook/useHorizontalScroll";
const LandingPage: React.FC = () => {
  useHorizontalScroll("scrollContainer");
  return (

    <main className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-emerald-800 via-teal-600 to-emerald-900">
      {/* Header cố định */}
      <Header />

      {/* Container ngang */}
      <div
        className="horizontal-sections flex h-screen transition-transform duration-700 ease-in-out"
        id="scrollContainer"
      >
        {/* Mỗi section = 1 màn hình */}
        <section className="w-screen h-screen flex-shrink-0 flex items-center justify-center">
          <Hero />
        </section>

        <section className="w-screen h-screen flex-shrink-0 flex items-center justify-center">
          <Products />
        </section>

      </div>


      <ChatAssistant />
    </main>
  );
};

export default LandingPage;
