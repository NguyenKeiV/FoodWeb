import React, { useState, useEffect } from "react";
import Spline from "@splinetool/react-spline";

const Hero = () => {
  const [key, setKey] = useState(0);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    const container = document.getElementById("scrollContainer");

    if (section && container) {
      const left = section.offsetLeft;
      container.style.transition = "transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)";
      container.style.transform = `translateX(-${left}px)`;
    }
  };

  useEffect(() => {
    // Reset Spline khi trang refresh để nó render lại chính giữa
    setKey(Date.now());
  }, []);

  // 4 món ăn featured
  const featuredFoods = [
    {
      id: 1,
      name: "Salad",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop"
    },
    {
      id: 2,
      name: "Cơm gạo lứt",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&h=200&fit=crop"
    },
    {
      id: 3,
      name: "Sinh tố",
      image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=200&h=200&fit=crop"
    },
    {
      id: 4,
      name: "Súp",
      image: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=200&h=200&fit=crop"
    }
  ];

  return (
    <div className="relative h-screen w-full">
      <div className="container mx-56 h-full px-1 lg-px-2">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 h-full items-start lg:mt-20">
          {/* Left Side - Content */}
          <div className="lg:col-span-3 flex flex-col justify-start gap-4 z-10 relative lg:pt-10">
            {/* Hero Title */}
            <div className="space-y-10">
              <div className="text-white space-y-4 flex flex-wrap items-baseline gap-x-4">
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-light leading-tight">
                  Mang đến món ăn
                </h1>

                <h1 className="text-4xl lg:text-6xl font-normal text-emerald-200 leading-tight whitespace-nowrap">
                  bổ dưỡng & ngon miệng
                </h1>
              </div>
              <div className="flex flex-wrap items-baseline gap-x-4">
                <h2 className="text-xl lg:text-2xl font-normal text-emerald-200 leading-tight whitespace-nowrap">
                  Đêm khuya tại
                </h2>
                <h3 className="text-2xl lg:text-3xl font-normal text-emerald-300 whitespace-nowrap">
                  Thủ Đức & Làng đại học
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-xl lg:text-2xl text-white/90 leading-relaxed max-w-3xl pt-7">
              Chúng tôi chuyên phục vụ các món ăn bổ dưỡng, ngon miệng cho sinh viên và người đi làm muộn.
              Giao hàng nhanh chóng, đảm bảo vệ sinh an toàn thực phẩm, mang đến bữa ăn đêm ấm áp và tiện lợi.
            </p>

            {/* Food Icons */}
            <div className="flex gap-16 pt-6 ml-5">
              {featuredFoods.map((food) => (
                <div
                  key={food.id}
                  className="group relative cursor-pointer"
                  title={food.name}
                >
                  <div className="w-14 h-12 rounded-full overflow-hidden border-2 border-white/30 shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-110 hover:border-emerald-400/60">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-full object-cover"
                    />
                  </div>


                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-20 pt-6">
              <button
                onClick={() => scrollToSection("menu")}
                className="px-8 py-4 bg-white text-emerald-800 font-bold text-lg rounded-full hover:bg-emerald-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:text-white"
              >
                Xem Menu
              </button>
              <button className="px-8 py-4 bg-emerald-600 text-white font-bold text-lg rounded-full hover:bg-emerald-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-white/30">
                Tải App Ngay
              </button>
            </div>
          </div>

          {/* Right Side - 3D Spoon */}
          <div className="lg:col-span-4 relative h-full flex items-start justify-center overflow-auto :hidden">
            <div className="w-full h-full pointer-events-auto">
              <Spline
                key={key}
                scene="https://prod.spline.design/6tIrkrAuPKUzCzOu/scene.splinecode"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;