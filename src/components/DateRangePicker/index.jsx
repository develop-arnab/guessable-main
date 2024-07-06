import { DatePicker } from "antd";
import PropTypes from "prop-types";

const DateRangePicker = ({
  value,
  onChange,
  style,
  size,
  disabled,
  disableBeforeStartDate,
}) => {
  const disabledDate = (current) => {
    return (
      new Date(current).getTime() < new Date(disableBeforeStartDate).getTime()
    );
  };
  return (
    <DatePicker
      style={style}
      size={size}
      value={value}
      onChange={onChange}
      disabled={disabled}
      disabledDate={disableBeforeStartDate ? disabledDate : undefined}
    />
  );
};
export default DateRangePicker;

DateRangePicker.propTypes = {
  value: PropTypes.string,
  disableBeforeStartDate: PropTypes.object,
  onChange: PropTypes.func,
  name: PropTypes.string,
  style: PropTypes.object,
  size: PropTypes.string,
  disabled: PropTypes.bool,
};
