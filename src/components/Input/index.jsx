import PropTypes from "prop-types";
const Input = ({ value, name, label, error, handleChange, handleBlur }) => {
  return (
    <>
      <div className="text-[12px] pl-0.5 pb-1 font-poppins">{label}</div>
      <div
        className={`flex align-bottom w-full rounded-md border-0 py-1.5 pl-2 shadow-sm ring-1 ring-inset ring-lightGray ${
          error ? "ring-red-600" : "ring-lightGray"
        } placeholder:text-lightGray focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
      >
        <input
          style={{ outline: "none" }}
          id="email_address"
          name={name}
          type="email"
          value={value}
          onChange={handleChange(name)}
          onBlur={handleBlur(name)}
          autoComplete={name}
          placeholder={label}
          className="block w-full outline-none bg-inherit m-1 "
        />
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

export default Input;

Input.propTypes = {
  value: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.string,
  style: PropTypes.func,
};
