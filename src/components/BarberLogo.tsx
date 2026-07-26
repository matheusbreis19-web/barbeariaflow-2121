import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BarberLogoProps {
  variant?: 'icon' | 'full' | 'sidebar' | 'header';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shopName?: string;
  showSubtext?: boolean;
}

export const BarberLogoSVG: React.FC<{ size?: number; className?: string }> = ({ size = 42, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Metallic Gold Gradient */}
        <linearGradient id="goldLuxuryGrad" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F9E7B9" />
          <stop offset="35%" stopColor="#D4AF37" />
          <stop offset="70%" stopColor="#AA7C11" />
          <stop offset="100%" stopColor="#E6C687" />
        </linearGradient>

        {/* Silver Metallic Gradient for Razor Blade */}
        <linearGradient id="silverRazorGrad" x1="30" y1="20" x2="90" y2="170" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#E2E8F0" />
          <stop offset="75%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>

        {/* Swoosh Wave Gradient */}
        <linearGradient id="swooshGoldGrad" x1="20" y1="100" x2="180" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5D061" />
          <stop offset="50%" stopColor="#E6C687" />
          <stop offset="100%" stopColor="#8A6208" />
        </linearGradient>
      </defs>

      {/* Main "B" Upper Loop */}
      <path
        d="M 82 38 
           H 134 
           C 168 38, 168 88, 130 88 
           H 82 
           Z"
        fill="url(#goldLuxuryGrad)"
      />
      {/* Inner Hole Upper Loop */}
      <path
        d="M 98 52 
           H 128 
           C 146 52, 146 74, 128 74 
           H 98 
           Z"
        fill="#0D0D10"
      />

      {/* Main "B" Lower Loop */}
      <path
        d="M 82 84 
           H 140 
           C 178 84, 178 146, 132 146 
           H 82 
           Z"
        fill="url(#goldLuxuryGrad)"
      />
      {/* Inner Hole Lower Loop */}
      <path
        d="M 98 98 
           H 132 
           C 152 98, 152 132, 132 132 
           H 98 
           Z"
        fill="#0D0D10"
      />

      {/* Straight Razor Blade (Forms Left Stem of 'B') */}
      <g id="RazorStem">
        {/* Blade Spine */}
        <path
          d="M 68 22
             C 68 18, 78 16, 84 22
             L 84 152
             C 84 158, 76 162, 68 156
             L 58 148
             L 68 22 Z"
          fill="url(#silverRazorGrad)"
        />

        {/* Razor Bevel & Blade Edge */}
        <path
          d="M 52 26
             L 76 20
             L 76 142
             L 58 158
             C 52 161, 48 152, 50 142
             L 62 34
             Z"
          fill="url(#silverRazorGrad)"
          stroke="#FFFFFF"
          strokeWidth="1.2"
        />

        {/* Shiny Highlight Line */}
        <path
          d="M 72 24 L 72 140"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Pivot Rivet */}
        <circle cx="72" cy="38" r="3.5" fill="#1E1E24" stroke="#FFFFFF" strokeWidth="1.5" />
      </g>

      {/* Swoosh Cut across center waist */}
      <path
        d="M 40 122 
           C 68 78, 115 82, 180 100 
           C 132 118, 85 132, 40 122 Z"
        fill="url(#swooshGoldGrad)"
      />
      <path
        d="M 42 122 
           C 72 82, 120 86, 178 101"
        stroke="#FFFFFF"
        strokeWidth="2"
        fill="none"
      />
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
    md: 40,
    lg: 52,
    xl: 72,
  };

  const svgSize = pixelSizes[size];

  if (variant === 'icon') {
    return (
      <div className={`relative flex items-center justify-center rounded-2xl bg-[#141418] border border-[#C5A059]/40 shadow-lg p-1.5 ${className}`}>
        <BarberLogoSVG size={svgSize} />
      </div>
    );
  }

  if (variant === 'sidebar' || variant === 'header') {
    return (
      <div className={`flex flex-col space-y-2 w-full ${className}`}>
        {/* Top Header Row */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex-shrink-0">
              <BarberLogoSVG size={38} />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="font-serif font-bold text-base text-[#F3E5AB] tracking-tight leading-none">
                BarbeariaFlow
              </div>
              <div className="text-[9px] text-[#C5A059] font-sans font-bold tracking-[0.2em] uppercase flex items-center gap-1 mt-1">
                <span>BARBERSHOP</span>
              </div>
            </div>
          </div>

          <span className="border border-[#C5A059]/60 text-[#C5A059] font-black text-[10px] px-2 py-0.5 rounded-full font-mono shadow-sm flex-shrink-0">
            V2.5
          </span>
        </div>

        {/* Subtitle shop name */}
        {showSubtext && (
          <div className="text-xs text-zinc-300 font-serif font-medium pl-1 truncate">
            {shopName}
          </div>
        )}
      </div>
    );
  }

  // Default 'full' variant
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#1E1E24] to-[#121215] border-2 border-[#C5A059]/60 flex items-center justify-center shadow-2xl p-2 mb-2">
        <BarberLogoSVG size={52} />
      </div>

      <div className="font-serif font-black text-xl text-[#F3E5AB] tracking-wide">
        BarbeariaFlow
      </div>
      
      {showSubtext && (
        <div className="text-[10px] text-[#C5A059] font-sans font-bold tracking-[0.3em] uppercase flex items-center gap-1.5 mt-1">
          <span>BARBERSHOP</span>
          <span className="text-xs">✂️</span>
        </div>
      )}
    </div>
  );
};
