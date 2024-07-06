/* eslint-disable react/prop-types */
import icon1 from "../assets/Icon.svg";
import { NavLink } from "react-router-dom";
const Sidebar = ({ open }) => {
  const adminRoutes = [
    {
      item: "Users",
      to: "/appusers",
      icon: icon1,
    },
  ];
  return (
    <div
      className={`${
        open ? "translate-x-0" : "-translate-x-full"
      } bg-sidebar border border-r  h-[calc(100vh-60px)] z-20 w-[250px] fixed top-[60px] left-0 transition-transform duration-300 ease-in-out transform p-2`}
    >
      {Array.isArray(adminRoutes) &&
        adminRoutes?.map((currElem, key) => {
          return (
            <NavLink
              className={({ isActive }) =>
                `flex items-center p-3 m-2 gap-2 font-semibold rounded-[100px] transition-all duration-200 ease-in-out ${
                  isActive
                    ? "bg-selected border border-selected"
                    : "hover:bg-gray-200 border-sidebar border-[1px]"
                }`
              }
              to={currElem?.to}
              key={key}
            >
              <img
                src={currElem?.icon}
                alt={currElem?.item}
                className="h-6 w-6"
              />
              <span className="text-sm">{currElem?.item}</span>
            </NavLink>
          );
        })}
    </div>
  );
};

export default Sidebar;
