import React from 'react';

interface BarberLogoProps {
  variant?: 'icon' | 'full' | 'sidebar' | 'header';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shopName?: string;
  showSubtext?: boolean;
}

export const BarberLogoSVG: React.FC<{ size?: number; className?: string }> = ({ size = 42, className = '' }) => {
  return (
    <img
      src="/logo.png"
      alt="Barbearia BARBERSHOP Logo"
      style={{ width: size, height: 'auto', objectFit: 'contain' }}
      className={`select-none ${className}`}
    />
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
    md: 42,
    lg: 56,
    xl: 80,
  };

  const imgSize = pixelSizes[size];

  if (variant === 'icon') {
    return (
      <div className={`relative flex items-center justify-center p-1 ${className}`}>
        <img src="/logo.png" alt="Barbearia Logo" className="w-10 h-auto object-contain" />
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
              <img src="/logo.png" alt="Barbearia Logo" className="w-10 h-auto object-contain" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="font-serif font-black text-base text-[#F3E5AB] tracking-tight leading-none">
                BarbeariaFlow
              </div>
              <div className="text-[9px] text-[#C5A059] font-sans font-extrabold tracking-[0.2em] uppercase flex items-center gap-1 mt-1">
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
      <div className="p-2 mb-2 flex items-center justify-center">
        <img src="/logo.png" alt="Barbearia Logo" className="w-24 h-auto object-contain drop-shadow-xl" />
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
