/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";
const Header = ({ name, children }) => {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-xl bg-white h-[60px] flex items-center px-5  z-10 border-b-2">
      <div className="flex-grow font-[700] text-heading flex items-center gap-3">
        <Link
          to="/"
          className="text-[20px] font-poppins text-gray3 flex items-center gap-2"
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
