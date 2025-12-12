import React from 'react';

export const CarrierLogo: React.FC<{ className?: string }> = ({ className }) => (
  <img 
    src="https://images.carriercms.com/image/upload/v1629825291/common/logos-svg/carrier-logo.svg"
    alt="Carrier Logo"
    className={className}
    onError={(e) => {
      // Fallback if image fails to load
      e.currentTarget.style.display = 'none';
    }}
  />
);