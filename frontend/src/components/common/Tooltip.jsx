import React, { useState } from 'react';

export const Tooltip = ({ text, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 text-xs text-slate-100 bg-slate-900/95 border border-slate-700/80 rounded-lg shadow-xl whitespace-nowrap pointer-events-none transition-all duration-200 backdrop-blur-md">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900/95" />
        </div>
      )}
    </div>
  );
};
