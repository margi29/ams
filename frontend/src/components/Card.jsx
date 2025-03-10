import React from "react";

const Card = ({ title, children, className = "", style = {} }) => {
  return (
    <div
      className={`bg-white p-6 rounded-2xl border border-gray-300 shadow-[6px_6px_15px_rgba(0,0,0,0.2),-6px_-6px_15px_rgba(255,255,255,0.8)] 
      transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[10px_10px_20px_rgba(0,0,0,0.3),-10px_-10px_20px_rgba(255,255,255,0.9)] ${className}`}
      style={style}
    >
      {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
      {children}
    </div>
  );
};

export default Card;
