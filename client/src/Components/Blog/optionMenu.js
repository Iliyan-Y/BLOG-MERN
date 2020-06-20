import React, { useContext, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

import { Menu, Button } from "antd";
//local
import { DataContext } from "../../DataContext";
import EditPost from "./EditPost";

const OptionMenu = (props) => {
  const goTo = useHistory();
  const { reRender, setReRender, setCurrentOpenPage, userToken } = useContext(
    DataContext
  );
  const [edit, setEdit] = useState(false);

  const handleDelete = () => {
    const config = {
      headers: { Authorization: `Bearer ${userToken}` },
    };

    axios
      .delete("/user/blog/" + props.each._id, config)
      .then(() => {
        setReRender(!reRender);
        setCurrentOpenPage("/user/blog/");
        goTo.push("/user/blog/");
      })
      .catch((err) => console.log("Error: " + err));
  };

  const handleEdit = () => {
    setEdit(!edit);
    setCurrentOpenPage("/user/blog/update/" + props.each._id);
    goTo.push("/user/blog/update/" + props.each._id);
  };

  return (
    <Menu
      onMouseEnter={() => props.setPanelDisabled(true)}
      onMouseLeave={() => props.setPanelDisabled(false)}
      style={{ textAlign: "center" }}
    >
      <Menu.Item>
        <Button
          onClick={handleEdit}
          style={{ background: "green" }}
          type="primary"
          shape="round"
        >
          Edit
        </Button>
      </Menu.Item>
      <Menu.Item style={{ display: edit ? "none" : "block" }}>
        <Button onClick={handleDelete} type="danger" shape="circle">
          -X-
        </Button>
      </Menu.Item>
      <div style={{ display: edit ? "block" : "none" }}>
        <EditPost each={props.each} setEdit={setEdit} edit={edit} />
      </div>
    </Menu>
  );
};

export default OptionMenu;
