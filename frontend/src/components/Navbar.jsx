import React from "react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[var(--primary-dark)] text-[var(--white)] py-4 shadow-md">
      <div className="flex items-center px-4">
        {/* Logo and Title */}
        <img src="/assets/logo.png" alt="Logo" className="h-10 w-10 mr-2" />
        <span className="text-lg font-bold text-[var(--accent)]">
          Asset Management
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
