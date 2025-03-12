import React from "react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#302757] text-white py-4 ">
      <div className="flex items-center px-4">
        {/* Logo and Title */}
        <img src="/assets/logo.png" alt="Logo" className="h-12 w-12 mr-1.5" />
        <span className="text-2xl font-bold text-white">
          Asset Management
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
