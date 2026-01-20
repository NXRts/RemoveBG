"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MoveHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
}

export default function ComparisonSlider({
  beforeImage,
  afterImage,
  className,
}: ComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(() => {
    setIsResizing(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isResizing || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;

      setSliderPosition(percentage);
    },
    [isResizing]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleMouseMove);
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden select-none rounded-2xl border border-white/10 shadow-2xl group",
        className
      )}
      style={{
         // Aspect ratio placeholder or max height could be set here
         // For now relying on image natural height
      }}
    >
      {/* After Image (Background) - The result (removed bg) */}
      <img
        src={afterImage}
        alt="After"
        className="block w-full h-auto object-cover pointer-events-none select-none bg-[url('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.8Q9tXn5tXn5tXn5tXn5t%26pid%3DApi&f=1&ipt=b1b225678486518174744114704705505054117070741170707441147047055&ipo=images')] bg-repeat" 
        // Using a checkered pattern for transparency is better, or a CSS gradient grid
        style={{
            backgroundImage: "linear-gradient(45deg, #1f1f1f 25%, transparent 25%), linear-gradient(-45deg, #1f1f1f 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1f1f1f 75%), linear-gradient(-45deg, transparent 75%, #1f1f1f 75%)",
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px" 
        }}
      />

      {/* Before Image (Foreground) - The original */}
      <div
        className="absolute top-0 left-0 bottom-0 overflow-hidden pointer-events-none select-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt="Before"
          className="block max-w-none h-full object-cover"
          style={{ width: containerRef.current ? containerRef.current.offsetWidth : '100%' }} 
          // Note: We need to ensure the inner image width matches the container width exactly
          // to keep it aligned. Using 100vw or similar is risky. 
          // Ideally: use object-fit: cover and ensure both images have same aspect ratio.
        />
        {/* Label */}
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
          Original
        </div>
      </div>
      
       {/* After Label */}
       <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider pointer-events-none">
          Removed BG
        </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize hover:shadow-[0_0_20px_2px_rgba(255,255,255,0.5)] transition-shadow z-20"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg transform active:scale-95 transition-transform text-black">
          <MoveHorizontal className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
