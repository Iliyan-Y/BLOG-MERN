import React, { useContext, useState } from "react";
import { Button } from "antd";

import { DataContext } from "../../../../DataContext";
import axios from "axios";

import EditMenu from "./EditMenu";

const NoteOptions = (props) => {
  const { userToken, setReRender, reRender } = useContext(DataContext);
  const [edit, setEdit] = useState(props.edit);

  //make important
  function makeImportant() {
    props.setHighlighter(!props.highlighter);
    const body = {
      noteId: props.each._id,
      id: props.sellectedList,
      isDone: props.each.isDone,
      newText: props.each.text,
      important: !props.each.important,
    };

    const config = {
      headers: { Authorization: `Bearer ${userToken}` },
    };

    axios
      .post("/toDoList/updateNote", body, config)
      .then((res) => {
        if (!props.each.important) {
          setReRender(!reRender);
        } else {
          setTimeout(() => setReRender(!reRender), 450);
        }
      })
      .catch((err) => console.log(err));
  }

  //delate note
  const handleDel = async () => {
    await props.setShow(!props.show);
    const body = {
      noteId: props.each._id,
      id: props.sellectedList,
    };

    const config = {
      headers: { Authorization: `Bearer ${userToken}` },
    };

    axios
      .post("/toDoList/removeNote", body, config)
      .then((res) => {
        setTimeout(() => setReRender(!reRender), 660);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div
      className="toDoBtns"
      style={{
        width: "15%",
        display: "flex",
        justifyContent: "space-around",
      }}
    >
      <Button
        onClick={makeImportant}
        style={{
          background: "yellow",
          color: "black",
        }}
        type="primary"
        shape="round"
      >
        !
      </Button>

      <EditMenu
        sellectedList={props.sellectedList}
        each={props.each}
        edit={edit}
        setEdit={setEdit}
      />

      <Button
        onClick={() => setEdit(!edit)}
        style={{ background: "green" }}
        type="primary"
        shape="round"
      >
        Edit
      </Button>

      <Button onClick={handleDel} type="danger" shape="circle">
        -X-
      </Button>
    </div>
  );
};

export default NoteOptions;
