import { Select } from "antd";
import PropTypes from "prop-types";

const AntdSelect = ({ options, className, value, handleChange }) => {
  return (
    <Select
      showSearch
      value={value}
      className={className}
      placeholder="Search to Select"
      optionFilterProp="children"
      filterOption={(input, option) =>
        (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
      }
      filterSort={(optionA, optionB) =>
        (optionA?.label ?? "")
          .toLowerCase()
          .localeCompare((optionB?.label ?? "").toLowerCase())
      }
      onChange={handleChange}
      options={options}
      size="large"
    />
  );
};

export default AntdSelect;

AntdSelect.propTypes = {
  style: PropTypes.object,
  handleChange: PropTypes.func,
  options: PropTypes.array,
  className: PropTypes.string,
  value: PropTypes.string,
};
