import React from 'react';

export const CarrierLogo: React.FC<{ className?: string }> = ({ className }) => (
  <img 
    src="/CarrierFile/logo.png"
    alt="Carrier Logo"
    className={className}
    onError={(e) => {
      // Fallback if image fails to load
      e.currentTarget.style.display = 'none';
    }}
  />
);