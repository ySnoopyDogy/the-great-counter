"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

const backgroundImages = [
  "/images/photo-1519225421980-715cb0215aed.jpg",
  "/images/photo-1469371670807-013ccf25f16a.jpg",
  "/images/photo-1511285560929-80b456fea0bc.jpg",
];

export default function Component() {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [imagesUrl, setImagesUrl] = useState<string[]>([]);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
  });

  const carouselInterval = useRef<NodeJS.Timeout | number>();

  const setCountdown = useCallback(() => {
    const weddingDate = new Date("2024-09-15T10:00:00");
    const now = new Date();
    const difference = weddingDate.getTime() - now.getTime();

    const dias = Math.floor(difference / (1000 * 60 * 60 * 24));
    const horas = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((difference / 1000 / 60) % 60);
    const segundos = Math.floor((difference / 1000) % 60);

    setTimeLeft({ dias, horas, minutos, segundos });
  }, []);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    const getImages = async () => {
      const response = await fetch(
        "https://cdn.menherabot.xyz/?marriage_reason=love"
      );

      const images = await response.json();
      const imagesArray = Array.from({ length: images.emilyekaua }).map(
        (_, i) =>
          `https://cdn.menherabot.xyz/images/emilyekaua/${
            i + 1
          }.png?marriage_reason=love`
      );

      setImagesUrl(imagesArray);
    };

    const nextImage = (first: boolean) => {
      carouselInterval.current = setTimeout(nextImage, 5000);

      if (imagesUrl.length === 0) return;

      if (first) return;
      setProgress(0);

      setCurrentCarouselIndex((prevIndex) =>
        prevIndex === imagesUrl.length - 1 ? 0 : prevIndex + 1
      );
    };

    (async () => {
      await getImages();
      nextImage(true);

      progressInterval = setInterval(() => {
        setProgress((prevProgress) => (prevProgress + 0.5) % 100);
      }, 25);
    })();

    return () => {
      clearInterval(progressInterval);
    };
  }, [imagesUrl.length]);

  useEffect(() => {
    const backgroundInterval = setInterval(
      () =>
        setCurrentBgIndex((prevIndex) =>
          prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
        ),
      8000
    );

    setInterval(setCountdown, 1000);
    setCountdown();

    return () => {
      clearTimeout(carouselInterval.current);
      clearInterval(backgroundInterval);
    };
  }, [setCountdown]);

  const resetCarousel = () => {
    setProgress(0);
    clearTimeout(carouselInterval.current);
    carouselInterval.current = setTimeout(nextCarouselImage, 5000);
  };

  const nextCarouselImage = () => {
    resetCarousel();

    if (imagesUrl.length === 0) return;
    setCurrentCarouselIndex((prevIndex) =>
      prevIndex === imagesUrl.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevCarouselImage = () => {
    resetCarousel();

    if (imagesUrl.length === 0) return;
    setCurrentCarouselIndex((prevIndex) =>
      prevIndex === 0 ? imagesUrl.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-pink-400 via-pink-300 to-blue-300">
      <AnimatePresence>
        <motion.img
          key={currentBgIndex}
          src={backgroundImages[currentBgIndex]}
          alt="Wedding background"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-700/30" />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="mb-8 text-4xl font-bold text-white sm:text-6xl">
          <Sparkles className="inline-block mr-2 h-8 w-8 text-blue-200 sm:h-12 sm:w-12" />
          Kauã e Emily
          <Sparkles className="inline-block ml-2 h-8 w-8 text-pink-200 sm:h-12 sm:w-12" />
        </h1>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
          {Object.entries(timeLeft).map(([unit, value], index) => (
            <div
              key={unit}
              className={`flex flex-col items-center rounded-lg p-2 backdrop-blur-sm ${
                index % 2 === 0
                  ? "bg-gradient-to-br from-pink-500/80 to-blue-400/80"
                  : "bg-gradient-to-br from-blue-400/80 to-pink-500/80"
              }`}
            >
              <span className="text-3xl font-bold text-white sm:text-5xl">
                {value}
              </span>
              <span className="text-sm uppercase text-white sm:text-base">
                {unit}
              </span>
            </div>
          ))}
        </div>
        {imagesUrl.length > 0 && (
          <div className="w-full max-w-2xl">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lg">
              <AnimatePresence initial={false}>
                <motion.img
                  key={currentCarouselIndex}
                  src={imagesUrl[currentCarouselIndex]}
                  alt={`Foto do casal ${currentCarouselIndex + 1}`}
                  className="absolute h-full w-full object-cover"
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ duration: 0.5 }}
                />
              </AnimatePresence>
              <button
                onClick={prevCarouselImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-pink-500/50 p-2 text-white hover:bg-pink-600/75"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextCarouselImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-blue-500/50 p-2 text-white hover:bg-blue-600/75"
                aria-label="Próxima foto"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <div className="absolute bottom-0 left-0 w-full bg-black/50 p-2">
                <div className="flex items-center justify-between">
                  <div className="h-1 flex-grow rounded-full bg-gray-300">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-pink-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="ml-4 flex space-x-2">
                    {imagesUrl.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 w-2 rounded-full ${
                          index === currentCarouselIndex
                            ? index % 2 === 0
                              ? "bg-pink-500"
                              : "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
