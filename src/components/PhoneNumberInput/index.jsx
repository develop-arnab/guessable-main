import PhoneInput from "react-phone-number-input";
import PropTypes from "prop-types";

const PhoneNumberInput = ({ setFieldValue, value, handleBlur }) => {
  return (
    <div className="block m-1 w-full">
      <PhoneInput
        onChange={(e) => {
          setFieldValue("phone_number", e);
        }}
        className={`w-full parent-class text-black`}
        value={value}
        onBlur={handleBlur("phone_number")}
        countrySelectComponent={() => <></>}
        international={true}
        withCountryCallingCode={false}
      />
    </div>
  );
};

export default PhoneNumberInput;

PhoneNumberInput.propTypes = {
  setFieldValue: PropTypes.func,
  handleBlur: PropTypes.any,
  value: PropTypes.string,
};
