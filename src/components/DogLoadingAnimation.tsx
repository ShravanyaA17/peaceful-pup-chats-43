import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

const DogLoadingAnimation = () => {
  const [dots, setDots] = useState("");
  const [tipIndex, setTipIndex] = useState(0);

  const tips = [
    "Peace is analyzing your responses...",
    "Generating personalized insights...",
    "Preparing your micro-tasks...",
    "Almost ready with your support plan...",
    "Crafting something special for you...",
  ];

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 2000);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(tipInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* Animated Dog */}
      <div className="relative mb-6">
        {/* Dog Body */}
        <div className="relative">
          {/* Main body */}
          <div className="w-16 h-12 bg-gradient-to-b from-amber-100 to-amber-200 rounded-full relative animate-bounce">
            {/* Dog head */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-b from-amber-100 to-amber-200 rounded-full border-2 border-amber-300">
              {/* Eyes */}
              <div className="absolute top-3 left-2 w-1.5 h-1.5 bg-slate-800 rounded-full animate-pulse"></div>
              <div className="absolute top-3 right-2 w-1.5 h-1.5 bg-slate-800 rounded-full animate-pulse"></div>

              {/* Nose */}
              <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-slate-700 rounded-full"></div>

              {/* Ears */}
              <div className="absolute -top-2 left-1 w-3 h-6 bg-amber-200 rounded-full transform -rotate-12 animate-pulse"></div>
              <div className="absolute -top-2 right-1 w-3 h-6 bg-amber-200 rounded-full transform rotate-12 animate-pulse"></div>
            </div>

            {/* Legs */}
            <div className="absolute -bottom-2 left-2 w-2 h-4 bg-amber-200 rounded-full"></div>
            <div className="absolute -bottom-2 right-2 w-2 h-4 bg-amber-200 rounded-full"></div>

            {/* Tail */}
            <div className="absolute top-2 -right-3 w-1 h-8 bg-amber-200 rounded-full transform rotate-45 origin-bottom animate-pulse"></div>
          </div>
        </div>

        {/* Floating hearts */}
        <div
          className="absolute -top-8 -left-4 text-pink-400 animate-bounce"
          style={{ animationDelay: "0s" }}
        >
          <Heart className="w-3 h-3 fill-current" />
        </div>
        <div
          className="absolute -top-6 -right-4 text-pink-400 animate-bounce"
          style={{ animationDelay: "0.5s" }}
        >
          <Heart className="w-2 h-2 fill-current" />
        </div>
        <div
          className="absolute -top-10 left-8 text-pink-400 animate-bounce"
          style={{ animationDelay: "1s" }}
        >
          <Heart className="w-2.5 h-2.5 fill-current" />
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-2">
        <p className="text-slate-700 font-medium transition-all duration-500">
          {tips[tipIndex]}
          {dots}
        </p>
        <p className="text-sm text-slate-500">
          🐾 Your peaceful companion is working...
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1 mt-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              dots.length > i ? "bg-peace-purple" : "bg-slate-300"
            }`}
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default DogLoadingAnimation;
