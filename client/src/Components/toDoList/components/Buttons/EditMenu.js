import React, { useState, useContext } from "react";
import { useTransition, animated } from "react-spring";
import { Button } from "antd";
import axios from "axios";
import { DataContext } from "../../../../DataContext";

const EditMenu = ({ setEdit, each, edit, sellectedList }) => {
  const [value, setValue] = useState(each.text);
  const { userToken, setReRender, reRender } = useContext(DataContext);

  const transitions = useTransition(edit, null, {
    from: { opacity: 0.4, transform: "translate(90%, 1%) scale(0.3) " },
    enter: { opacity: 1, transform: "translate(-1%, -83%) scale(1)" },
    leave: {
      opacity: 0,
      transform: "translate(90%, 1%) scale(0.1)",
    },
    config: { mass: 3.2, tension: 194, friction: 27 },
  });

  function hanldeEdit() {
    const body = {
      noteId: each._id,
      id: sellectedList,
      isDone: each.isDone,
      newText: value,
      important: each.important,
    };

    const config = {
      headers: { Authorization: `Bearer ${userToken}` },
    };

    axios
      .post("http://localhost:5000/toDoList/updateNote", body, config)
      .then((res) => {
        setReRender(!reRender);
        setEdit(false);
      })
      .catch((err) => console.log(err));
  }

  return transitions.map(
    ({ item, key, props }) =>
      item && (
        <div
          key={key}
          style={{
            // display: edit ? "flex" : "none",
            flexDirection: "column",
            justifyContent: "center",
            marginTop: "0.5em",
          }}
        >
          <animated.div style={props} id="NoteEdit">
            <textarea
              id="editTxAre"
              style={{ width: "90%", borderRadius: "8px", resize: "none" }}
              rows="4"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <div>
              <Button
                onClick={hanldeEdit}
                shape="circle"
                style={{ margin: "0.5em 0.5em 0" }}
              >
                Ok
              </Button>
              <Button onClick={() => setEdit(false)} shape="round">
                Cansel
              </Button>
            </div>
          </animated.div>
        </div>
      )
  );
};

export default EditMenu;
