import React, { useState } from "react";
import { Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
//local
import Img from "./Icons/Img.svg";
import { ToolBtn } from "./ToolBar";

const ImageAdd = (props) => {
  const [url, setUrl] = useState("");
  const [visible, setVisible] = useState(false);

  const addImage = () => {
    const { editorState, onChange } = props;
    onChange(props.modifier(editorState, url));
    setVisible(false);
  };

  const changeUrl = (evt) => {
    setUrl(evt.target.value);
  };

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <input
          type="text"
          placeholder="Paste the image url …"
          onChange={changeUrl}
          value={url}
        />
        <ToolBtn onClick={addImage}>Add</ToolBtn>
        <ToolBtn onClick={() => setVisible(false)}>X</ToolBtn>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown
      placement="bottomCenter"
      onClick={() => setVisible(!visible)}
      visible={visible}
      overlay={menu}
      trigger={["click"]}
    >
      <ToolBtn onClick={() => setVisible(true)} className="ant-dropdown-link">
        <img style={{ width: "25px" }} src={Img} alt="pic" />
        <DownOutlined />
      </ToolBtn>
    </Dropdown>
  );
};

export default ImageAdd;
