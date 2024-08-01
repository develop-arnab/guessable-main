/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const Header = ({ name, children }) => {
    const [fontSizeClass, setFontSizeClass] = useState("text-[20px]");

    useEffect(() => {
      const updateFontSize = () => {
        if (window.innerWidth < 400) {
          setFontSizeClass("text-[15px]");
        } else {
          setFontSizeClass("text-[20px]");
        }
      };
      updateFontSize();
      window.addEventListener("resize", updateFontSize);
      return () => window.removeEventListener("resize", updateFontSize);
    }, []);
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-xl bg-white h-[60px] flex items-center px-5  z-10 border-b-2">
      <div className="flex-grow font-[700] text-heading flex items-center gap-3">
        <Link
          to="/"
          className={`${fontSizeClass} font-poppins text-gray3 flex items-center gap-2`}
        >
          <img src="/vite.svg" alt="logo" className="h-[30px] w-[30px]" />
          <span>{name}</span>
        </Link>
      </div>
      {children}
    </div>
  );
};

export default Header;
