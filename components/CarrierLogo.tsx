import React from 'react';

export const CarrierLogo: React.FC<{ className?: string }> = ({ className }) => (
  <img 
    src="/logo.png" 
    alt="Carrier Logo" 
    className={`object-contain ${className}`}
  />
);