// CustomSelect.jsx
import React from "react";
import { Select } from "antd";
import PropTypes from "prop-types";
import "./CustomSelect.css";      // ① import your overrides

const CustomSelect = ({ options, className, value, handleChange }) => (
  <Select
    showSearch
    value={value}
    className={className}
    placeholder="Search to Select"
    optionFilterProp="children"
    filterOption={(input, option) =>
      (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
    }
    filterSort={(a, b) =>
      (a?.label ?? "").toLowerCase().localeCompare((b?.label ?? "").toLowerCase())
    }
    onChange={handleChange}
    options={options}
    size="large"
    dropdownClassName="multiline-dropdown"    // ② tag the popup
  />
);

CustomSelect.propTypes = {
  style: PropTypes.object,
  handleChange: PropTypes.func,
  options: PropTypes.array,
  className: PropTypes.string,
  value: PropTypes.string,
};

export default CustomSelect;
