import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import PropTypes from "prop-types";

const PhoneNumberInput = ({
  label,
  error,
  setFieldValue,
  value,
  handleBlur,
  name,
}) => {
  return (
    <>
      <div>
        <div className="text-[12px] pl-0.5 pb-1 font-poppins">{label}</div>
        <PhoneInput
          onChange={(e) => {
            setFieldValue(name, e);
          }}
          defaultCountry="US"
          className={`flex bg-black align-bottom w-full rounded-md border-0 py-[11px] px-[14px] shadow-sm ring-1 ring-inset ring-lightGray parent-class ${
            error ? "ring-red-600" : "ring-lightGray"
          } placeholder:text-lightGray focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
          value={value}
          placeHolder={label}
          onBlur={handleBlur(name)}
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

export default PhoneNumberInput;

PhoneNumberInput.propTypes = {
  value: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  setFieldValue: PropTypes.func,
  handleBlur: PropTypes.func,
};
