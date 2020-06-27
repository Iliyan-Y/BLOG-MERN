import React, { useContext } from "react";
import { Checkbox } from "antd";
import axios from "axios";
import { DataContext } from "../../../../DataContext";

const CheckBox = (props) => {
  const { userToken, setReRender, reRender } = useContext(DataContext);

  function handleCheck() {
    const body = {
      noteId: props.each._id,
      id: props.sellectedList,
      isDone: !props.each.isDone,
      newText: props.each.text,
      important: false,
    };

    const config = {
      headers: { Authorization: `Bearer ${userToken}` },
    };

    axios
      .post("/toDoList/updateNote", body, config)
      .then((res) => {
        setReRender(!reRender);
      })
      .catch((err) => console.error(err));
  }

  return <Checkbox onChange={handleCheck} checked={props.each.isDone} />;
};

export default CheckBox;
