/* eslint-disable react/prop-types */
import React from "react";
const Index = ({
  text,
  isLoading,
  width,
  onClick,
  type,
  className,
  authButton,
}) => {
  return (
    <div className="flex w-full">
      <button
        onClick={onClick}
        type={type}
        className={`flex w-full justify-center items-center rounded-md px-5 py-1.5 text-sm font-semibold font-poppins leading-6 shadow-sm text-secondary border border-heading hover:bg-heading bg-primary transition hover:border-heading  hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
          isLoading ? "cursor-not-allowed" : "cursor-pointer"
        }  ${width ? width : ""} ${className ? className : ""}  ${
          authButton === true ? "bg-purple" : "bg-purple"
        }  ${authButton === true ? "text-white" : "text-secondary"} `}
      >
        <div className="flex justify-center items-center">
          {isLoading ? "Please wait ..." : text}
        </div>
      </button>
    </div>
  );
};

export default Index;
