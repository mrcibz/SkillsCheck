"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const images = [
  { src: "/hero_img_0.jpg", alt: "Developer typing code on a laptop keyboard" },
  { src: "/hero_img_1.jpg", alt: "Stack of programming books including Clean Code and Cracking the Coding Interview, with a monitor showing code in the background" },
  { src: "/hero_img_2.jpg", alt: "Professional in a business suit, representing career readiness after technical interview preparation" },
];

export default function HeroImageCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl sm:aspect-[3/4] lg:max-w-lg">
      {/* Gradient overlay to blend with background */}
      <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl ring-1 ring-inset ring-white/10" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#0B1628] via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-[#0B1628]/60 via-transparent to-[#0B1628]/60" />

      {images.map(({ src, alt }, i) => (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          priority={i === 0}
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {images.map(({ alt }, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Show image: ${alt}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 bg-blue-500"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
