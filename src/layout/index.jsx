/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Header from "./header";
import Sidebar from "./sidebar";
const Index = ({ children }) => {
  const [open, setOpen] = useState(true);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const isMobile = screenWidth <= 768;

  useEffect(() => {
    function handleResize() {
      setScreenWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile]);

  return (
    <div className="w-[100%] h-[100vh]">
      <Header open={open} setOpen={setOpen} isSignIn={true} />
      <div className="w-full flex">
        <Sidebar open={open} />
        <div className={`w-[100%] mt-[60px] ${open ? "lg:ml-[250px]" : ""}`}>
          <div className={`${!open ? "w-[100%]" : "w-[100%] "}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
