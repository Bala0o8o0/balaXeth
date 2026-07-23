import React, { ReactNode } from "react";

interface HexaCardProps {
  children?: ReactNode;
  className?: string;
}

export function HexaCard({ children, className = "" }: HexaCardProps) {
  return (
    <div className={`relative w-[280px] h-[300px] md:w-[320px] md:h-[340px] flex-shrink-0 flex items-center justify-center z-10 group ${className}`}>
      {/* Heavy Outer Geometric Base (Forms the thick border) */}
      <div 
        className="absolute inset-0 bg-[#ffd400]/90 shadow-[0_0_15px_rgba(255, 212, 0,0.3)] transition-all duration-500 group-hover:bg-[#ffd400]"
        style={{ 
          clipPath: 'polygon(0 30px, 30px 0, calc(50% - 30px) 0, calc(50% - 25px) 10px, calc(50% + 25px) 10px, calc(50% + 30px) 0, calc(100% - 30px) 0, 100% 30px, 100% calc(50% - 40px), calc(100% - 10px) calc(50% - 30px), calc(100% - 10px) calc(50% + 30px), 100% calc(50% + 40px), 100% calc(100% - 30px), calc(100% - 30px) 100%, calc(50% + 30px) 100%, calc(50% + 25px) calc(100% - 10px), calc(50% - 25px) calc(100% - 10px), calc(50% - 30px) 100%, 30px 100%, 0 calc(100% - 30px), 0 calc(50% + 40px), 10px calc(50% + 30px), 10px calc(50% - 30px), 0 calc(50% - 40px))' 
        }}
      >
        {/* Inner cutout to create the perfect gapless matching mechanical frame effect */}
        <div 
          className="absolute inset-[1px] bg-[#050000]"
          style={{ 
            clipPath: 'polygon(0 30px, 30px 0, calc(50% - 30px) 0, calc(50% - 25px) 10px, calc(50% + 25px) 10px, calc(50% + 30px) 0, calc(100% - 30px) 0, 100% 30px, 100% calc(50% - 40px), calc(100% - 10px) calc(50% - 30px), calc(100% - 10px) calc(50% + 30px), 100% calc(50% + 40px), 100% calc(100% - 30px), calc(100% - 30px) 100%, calc(50% + 30px) 100%, calc(50% + 25px) calc(100% - 10px), calc(50% - 25px) calc(100% - 10px), calc(50% - 30px) 100%, 30px 100%, 0 calc(100% - 30px), 0 calc(50% + 40px), 10px calc(50% + 30px), 10px calc(50% - 30px), 0 calc(50% - 40px))' 
          }}
        />
      </div>

      {/* Additional heavy corner accent blocks - Made thin to match */}
      <div className="absolute top-[-4px] left-[20%] w-12 h-[2px] bg-[#ffd400] shadow-[0_0_10px_#ffd400]" />
      <div className="absolute bottom-[-4px] right-[20%] w-12 h-[2px] bg-[#ffd400] shadow-[0_0_10px_#ffd400]" />
      <div className="absolute top-[25%] left-[-4px] w-[2px] h-12 bg-[#ffd400] shadow-[0_0_10px_#ffd400]" />
      <div className="absolute bottom-[25%] right-[-4px] w-[2px] h-12 bg-[#ffd400] shadow-[0_0_10px_#ffd400]" />

      {/* Micro tech details: The 2x2 grid squares from the reference image */}
      <div className="absolute top-[12%] left-[12%] flex flex-col gap-1.5 z-20">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 bg-[#ffd400]" />
          <div className="w-2 h-2 bg-[#ffd400]" />
        </div>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 bg-[#ffd400]" />
          <div className="w-2 h-2 bg-[#ffd400]" />
        </div>
      </div>

      <div className="absolute bottom-[12%] right-[12%] flex flex-col gap-1.5 z-20">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 bg-[#ffd400]" />
          <div className="w-2 h-2 bg-[#ffd400]" />
        </div>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 bg-[#ffd400]" />
          <div className="w-2 h-2 bg-[#ffd400]" />
        </div>
      </div>

      {/* Center Content Container */}
      <div className="absolute inset-[18px] md:inset-[22px] bg-[#020000] overflow-hidden z-10 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
