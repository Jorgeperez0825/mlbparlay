import { useState } from 'react';
import Image from 'next/image';

interface TeamLogoProps {
  teamId: number;
  teamName: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: {
    container: "w-8 h-8",
    image: 32
  },
  md: {
    container: "w-12 h-12",
    image: 48
  },
  lg: {
    container: "w-16 h-16",
    image: 64
  }
};

export const TeamLogo = ({ teamId, teamName, size = 'md' }: TeamLogoProps) => {
  const [imgError, setImgError] = useState(false);
  
  const fallbackLogo = '/images/mlb-fallback-logo.png'; // Asegúrate de tener esta imagen en tu proyecto
  
  const logoUrl = imgError 
    ? fallbackLogo 
    : `https://www.mlbstatic.com/team-logos/${teamId}.svg`;

  const { container, image } = SIZES[size];

  return (
    <div className={`relative ${container}`}>
      <Image
        src={logoUrl}
        alt={teamName}
        width={image}
        height={image}
        className="object-contain"
        onError={() => setImgError(true)}
        unoptimized // Para URLs externos
      />
    </div>
  );
}; 