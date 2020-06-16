import React from "react";
import { Select } from "antd";

const SortForm = (props) => {
  const { Option } = Select;

  return (
    <Select
      defaultValue="-1"
      style={{ width: 120 }}
      onChange={(value) => {
        props.setSellect(value);
        props.setReRender(!props.reRender);
      }}
    >
      <Option value="1">Old First</Option>
      <Option value="-1">New First</Option>
    </Select>
  );
};

export default SortForm;
