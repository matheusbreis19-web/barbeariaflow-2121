import React from 'react';

interface BarberLogoProps {
  variant?: 'icon' | 'full' | 'sidebar' | 'header';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shopName?: string;
  showSubtext?: boolean;
}

export const BarberLogoSVG: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-[0_4px_12px_rgba(212,175,55,0.25)] ${className}`}
    >
      <defs>
        {/* Luxury Gold Metallic Gradient */}
        <linearGradient id="brandGoldGrad" x1="10" y1="10" x2="190" y2="190" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF2CB" />
          <stop offset="25%" stopColor="#F5D061" />
          <stop offset="55%" stopColor="#D4AF37" />
          <stop offset="85%" stopColor="#997517" />
          <stop offset="100%" stopColor="#E6C687" />
        </linearGradient>

        {/* Silver Chrome Razor Gradient */}
        <linearGradient id="razorChromeGrad" x1="20" y1="10" x2="90" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor="#CBD5E1" />
          <stop offset="80%" stopColor="#64748B" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>

        {/* Swoosh Wave Gradient */}
        <linearGradient id="waveSwooshGrad" x1="20" y1="90" x2="180" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#F5D061" />
          <stop offset="100%" stopColor="#997517" />
        </linearGradient>
      </defs>

      {/* Main "B" Serif Body */}
      {/* Upper Loop of B */}
      <path
        d="M 82 28 H 136 C 168 28, 168 76, 132 76 H 82 Z"
        fill="url(#brandGoldGrad)"
      />
      <path
        d="M 98 42 H 128 C 144 42, 144 62, 128 62 H 98 Z"
        fill="#0A0A0A"
      />

      {/* Lower Loop of B */}
      <path
        d="M 82 72 H 142 C 178 72, 178 136, 132 136 H 82 Z"
        fill="url(#brandGoldGrad)"
      />
      <path
        d="M 98 86 H 132 C 150 86, 150 122, 132 122 H 98 Z"
        fill="#0A0A0A"
      />

      {/* Straight Razor (Navalha) forming left stem */}
      <g id="NavalhaStem">
        {/* Razor Spine */}
        <path
          d="M 68 18 C 68 14, 76 12, 82 18 L 82 144 C 82 150, 74 154, 68 148 L 58 140 L 68 18 Z"
          fill="url(#razorChromeGrad)"
        />
        {/* Beveled Blade Edge */}
        <path
          d="M 52 22 L 76 16 L 76 136 L 58 150 C 52 153, 48 144, 50 134 L 62 30 Z"
          fill="url(#razorChromeGrad)"
          stroke="#FFFFFF"
          strokeWidth="1.2"
        />
        {/* Razor Highlight Line */}
        <line x1="72" y1="20" x2="72" y2="134" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        {/* Hinge Pin */}
        <circle cx="72" cy="34" r="3.5" fill="#0A0A0A" stroke="#FFFFFF" strokeWidth="1.5" />
      </g>

      {/* Dynamic Swoosh Wave crossing middle waist */}
      <path
        d="M 36 112 C 65 72, 115 76, 184 96 C 132 112, 85 126, 36 112 Z"
        fill="url(#waveSwooshGrad)"
      />
      <path
        d="M 38 112 C 68 76, 118 80, 180 97"
        stroke="#FFFFFF"
        strokeWidth="2"
        fill="none"
      />

      {/* Scissors Icon at bottom */}
      <g id="BottomScissors" transform="translate(100, 168) scale(0.7)">
        <circle cx="-12" cy="14" r="5" stroke="url(#brandGoldGrad)" strokeWidth="2.5" fill="none" />
        <circle cx="12" cy="14" r="5" stroke="url(#brandGoldGrad)" strokeWidth="2.5" fill="none" />
        <line x1="-8" y1="10" x2="10" y2="-12" stroke="url(#brandGoldGrad)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="8" y1="10" x2="-10" y2="-12" stroke="url(#brandGoldGrad)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="0" cy="-1" r="2" fill="url(#brandGoldGrad)" />
      </g>
    </svg>
  );
};

export const BarberLogo: React.FC<BarberLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  shopName = 'Barbearia do Neguinho',
  showSubtext = true,
}) => {
  const pixelSizes = {
    sm: 32,
    md: 46,
    lg: 60,
    xl: 84,
  };

  const logoSize = pixelSizes[size];

  if (variant === 'icon') {
    return (
      <div className={`relative flex items-center justify-center p-1 ${className}`}>
        <BarberLogoSVG size={logoSize} />
      </div>
    );
  }

  if (variant === 'sidebar' || variant === 'header') {
    return (
      <div className={`flex flex-col space-y-1.5 w-full ${className}`}>
        {/* Top Header Row */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex-shrink-0">
              <BarberLogoSVG size={42} />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="font-serif font-black text-base text-[#FFF2CB] tracking-tight leading-none">
                Barbearia
              </div>
              <div className="text-[9px] text-[#D4AF37] font-sans font-black tracking-[0.25em] uppercase flex items-center gap-1 mt-1">
                <span>BARBERSHOP</span>
              </div>
            </div>
          </div>

          <span className="border border-[#D4AF37]/50 text-[#D4AF37] font-black text-[10px] px-2 py-0.5 rounded-full font-mono shadow-sm flex-shrink-0 bg-[#D4AF37]/10">
            V2.5
          </span>
        </div>

        {/* Subtitle shop name */}
        {showSubtext && (
          <div className="text-xs text-zinc-400 font-serif font-semibold pl-1 truncate">
            {shopName}
          </div>
        )}
      </div>
    );
  }

  // Default 'full' variant
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <div className="p-1 mb-2 flex items-center justify-center">
        <BarberLogoSVG size={88} />
      </div>

      <div className="font-serif font-black text-2xl text-[#FFF2CB] tracking-wide mt-1">
        Barbearia
      </div>
      
      {showSubtext && (
        <div className="text-[10px] text-[#D4AF37] font-sans font-black tracking-[0.3em] uppercase flex items-center gap-1.5 mt-1">
          <span>BARBERSHOP</span>
          <span className="text-xs">✂️</span>
        </div>
      )}
    </div>
  );
};
