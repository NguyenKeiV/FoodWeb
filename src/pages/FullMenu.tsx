import React, { useState } from "react";
import { motion } from "framer-motion";

const items = [
  { id: 1, title: "Card 1", image: "https://picsum.photos/300/200?1" },
  { id: 2, title: "Card 2", image: "https://picsum.photos/300/200?2" },
  { id: 3, title: "Card 3", image: "https://picsum.photos/300/200?3" },
  { id: 4, title: "Card 4", image: "https://picsum.photos/300/200?4" },
  { id: 5, title: "Card 5", image: "https://picsum.photos/300/200?5" },
];

export default function Coverflow() {
  const [active, setActive] = useState(2);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 overflow-hidden">
      <div className="relative flex gap-4">
        {items.map((item, i) => {
          const offset = i - active;
          const scale = offset === 0 ? 1 : 0.8;
          const zIndex = offset === 0 ? 10 : 5;
          const rotateY = offset * 25; // nghiêng 3D
          const translateX = offset * 180; // dịch ra hai bên

          return (
            <motion.div
              key={item.id}
              className="absolute"
              style={{
                zIndex,
                transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                transformStyle: "preserve-3d",
                transition: "all 0.5s ease",
              }}
              onClick={() => setActive(i)}
            >
              <img
                src={item.image}
                alt={item.title}
                className={`rounded-2xl shadow-xl ${i === active ? "border-4 border-white" : ""
                  }`}
              />
              <p className="text-center text-white mt-2">{item.title}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
