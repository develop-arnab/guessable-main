/* eslint-disable react/prop-types */
import { theme } from "antd";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";
import {
  convertToYYYYMMDD,
  generateRandomDateInRange,
} from "../../../utils/constant";

const CustomCalender = ({
  open,
  setOpen,
  setUserSelectedDate,
  questionLoading,
  errorMessage,
  setGlobalSelectedDate,
}) => {
  const [value, onChange] = useState(null);

  const { token } = theme.useToken();
  const wrapperStyle = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  const tileDisabled = ({ date, view }) => {
    if (view === "month") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return (
        date > yesterday ||
        date < new Date(yesterday.setDate(yesterday.getDate() - 60))
      );
    }
  };

  const handleClick = (questionType) => {
    if (questionType === "random") {
      onChange(null);
      setUserSelectedDate(generateRandomDateInRange());
      setGlobalSelectedDate(true);
      if (!errorMessage) {
        setOpen(!open);
      }
    } else if (questionType === "not_random" && value) {
      setUserSelectedDate(convertToYYYYMMDD(value));
      setGlobalSelectedDate(true);
      if (!errorMessage) {
        setOpen(!open);
      }
    }
  };

  return (
    <div className="flex justify-center flex-col items-center">
      <div className="text-red-500 flex my-[3px] justify-center w-[300px] items-center text-sm font-semibold font-poppins leading-6 shadow-sm h-2">
        {errorMessage ? errorMessage : ""}
      </div>
      <button
        onClick={() => handleClick("random")}
        className="flex mt-[35px] mb-[10px] justify-center w-[300px] items-center rounded-md px-5 py-1.5 text-sm font-semibold font-poppins leading-6 shadow-sm text-secondary border border-heading hover:bg-heading bg-purple transition hover:border-heading  text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Random Question
      </button>
      <div style={wrapperStyle}>
        <div>
          <Calendar
            onChange={onChange}
            value={value}
            tileDisabled={tileDisabled}
          />
        </div>
      </div>
      <button
        onClick={() => handleClick("not_random")}
        className="flex my-[10px] justify-center w-[300px] items-center rounded-md px-5 py-1.5 text-sm font-semibold font-poppins leading-6 shadow-sm text-secondary border border-heading hover:bg-heading bg-purple transition hover:border-heading  text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Go
      </button>
      <div className="flex my-[10px] justify-center w-[300px] items-center text-sm font-semibold font-poppins leading-6 shadow-sm h-2">
        {questionLoading ? "Please Wait..." : ""}
      </div>
    </div>
  );
};

export default CustomCalender;
