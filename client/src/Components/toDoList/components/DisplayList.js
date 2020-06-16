import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../DataContext";
import axios from "axios";

//local
import AnimatedList from "./AnimatedList";

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
            <AnimatedList
              key={each._id}
              each={each}
              sellectedList={props.sellectedList}
            />
          ))
        : ""}
    </div>
  );
};

export default DisplayList;
