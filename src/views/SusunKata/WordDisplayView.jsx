import React from "react";

function WordDisplayView({
  letters,
  currentIndex,
  animatingLetterIndex,
  isTransitioning = false,
}) {
  return (
    <div className="flex gap-2 text-4xl md:text-5xl font-bold tracking-widest px-2">
      {letters.map((char, index) => (
        <span
          key={index}
          className={`transition-all duration-500 transform
            ${
              index === currentIndex
                ? "text-white"
                : index < currentIndex
                ? "text-green-300"
                : "text-purple-300"
            }
            ${
              animatingLetterIndex === index
                ? "scale-150 text-green-400"
                : "scale-100"
            }
            ${isTransitioning ? "opacity-30" : ""}
          `}
        >
          {char}
        </span>
      ))}
    </div>
  );
}

export default WordDisplayView;
