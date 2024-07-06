import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import PropTypes from "prop-types";

const Password = ({
  value,
  name,
  label,
  error,
  handleChange,
  handleBlur,
  openEye,
  handleEyeOpen,
}) => {
  return (
    <>
      <div>
        <div className="text-[12px] pl-0.5 pb-1 font-poppins">{label}</div>
        <div
          className={`flex align-bottom w-full rounded-md border-0 py-1.5 pl-2 shadow-sm ring-1 ring-inset ring-lightGray ${
            error ? "ring-red-600" : "ring-lightGray"
          } placeholder:text-lightGray focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
        >
          <input
            id={name}
            name={name}
            type={openEye ? "password" : "text"}
            autoComplete={name}
            value={value}
            onChange={handleChange(name)}
            onBlur={handleBlur(name)}
            placeholder={label}
            required
            className="block w-full outline-none bg-inherit m-1 "
          />
          {openEye ? (
            <div
              onClick={handleEyeOpen}
              className="block mt-0 p-2 mr-2 cursor-pointer"
            >
              <AiFillEyeInvisible className="text-[20px] text-lightGray" />
            </div>
          ) : (
            <div
              onClick={handleEyeOpen}
              className="block mt-0 p-2 mr-2 cursor-pointer"
            >
              <AiFillEye className="text-[20px] text-lightGray" />
            </div>
          )}
        </div>
      </div>
      {error ? (
        <p className="text-[10px] text-red-600 font-semibold mt-1 font-poppins">
          {error}
        </p>
      ) : (
        ""
      )}
    </>
  );
};

export default Password;

Password.propTypes = {
  value: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  handleChange: PropTypes.func,
  handleEyeOpen: PropTypes.func,
  handleBlur: PropTypes.string,
  openEye: PropTypes.bool,
};
