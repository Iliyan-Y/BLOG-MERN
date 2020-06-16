import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../../DataContext";
import axios from "axios";

//localComponents
import CheckBox from "../Buttons/CheckBox";
import NoteOptions from "../Buttons/NoteOptions";
import NoteText from "../NoteText";

const DisplayList = (props) => {
  const [notes, setNotes] = useState([]);
  const { userToken, reRender } = useContext(DataContext);

  useEffect(() => {
    const body = {
      listId: props.sellectedList,
    };

    const config = {
      headers: { Authorization: `Bearer ${userToken}` },
    };

    const unsub = () => {
      axios
        .post("http://localhost:5000/toDoList/sellectList", body, config)
        .then((res) => {
          setNotes(res.data.notes);
        })
        .catch((err) => console.log(err));
    };
    return unsub();
  }, [props.sellectedList, reRender]);

  return (
    <div style={{ opacity: props.sellectedList === "" ? "15%" : "100%" }}>
      {/* -------------Table Head--------------- */}
      <div
        className="ToDoTask"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          background: "pink",
          padding: "0.5em",
        }}
      >
        <div style={{ width: "5%" }}></div>
        <h1 className="toDoItems" style={{ width: "60%" }}>
          Tasks
        </h1>
        <h1 id="TaskDate" style={{ width: "15%" }}>
          Date Created
        </h1>
        <div style={{ width: "15%" }}></div>
      </div>
      {/* -------------Table Body--------------- */}

      {notes !== undefined
        ? notes.map((each) => (
            <div
              className="ToDoTask"
              key={each._id}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                background: "lightgreen",
                padding: "0.5em",
                border: "0.8px solid grey",
                margin: "1.5px 0",
                borderRadius: "2.5px",
                flexWrap: "wrap",
              }}
            >
              <div
                className="toDoItems"
                style={{
                  width: "5%",
                }}
              >
                <CheckBox each={each} sellectedList={props.sellectedList} />
              </div>
              <NoteText
                text={each.text}
                isDone={each.isDone}
                important={each.important}
              />
              <p className="toDoItems" style={{ width: "15%" }}>
                {each.createdAt.replace("T", " ").slice(0, -5)}
              </p>

              <NoteOptions each={each} sellectedList={props.sellectedList} />
            </div>
          ))
        : ""}
    </div>
  );
};

export default DisplayList;
