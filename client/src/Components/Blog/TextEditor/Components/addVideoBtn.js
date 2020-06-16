import React, { useState } from "react";
import { Menu, Dropdown } from "antd";
import { DownOutlined, VideoCameraAddOutlined } from "@ant-design/icons";

import { ToolBtn } from "./ToolBar";

const AddVideo = (props) => {
  const [url, setUrl] = useState("");
  const [visible, setVisible] = useState(false);

  const addVideo = () => {
    const { editorState, onChange } = props;
    onChange(props.modifier(editorState, { src: url }));
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
          placeholder="Paste the video url …"
          onChange={changeUrl}
          value={url}
        />
        <ToolBtn onClick={addVideo}>Add</ToolBtn>
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
        <VideoCameraAddOutlined style={{ width: "25px" }} />
        <DownOutlined />
      </ToolBtn>
    </Dropdown>
  );
};

export default AddVideo;
