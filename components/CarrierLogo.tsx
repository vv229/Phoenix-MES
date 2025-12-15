import React from 'react';

export const CarrierLogo: React.FC<{ className?: string }> = ({ className }) => (
  <img 
    src="https://images.carriercms.com/image/upload/h_150,q_100,f_auto/v1573562016/common/logos/carrier-corp-logo.png" 
    alt="Carrier Logo" 
    className={`object-contain ${className}`}
  />
);