import React, { useState, useContext } from "react";
import axios from "axios";
import { DataContext } from "../../../DataContext";

const CreateNote = (props) => {
  const [newNote, setNewNote] = useState("");
  const { userToken, reRender, setReRender } = useContext(DataContext);

  function handleSave() {
    const body = {
      text: newNote,
      isDone: false,
      id: props.sellectedList,
      important: false,
    };

    const config = {
      headers: { Authorization: `Bearer ${userToken}` },
    };

    axios
      .post("/toDoList/newNote", body, config)
      .then((res) => {
        setNewNote("");
        setReRender(!reRender);
      })
      .catch((err) => console.error(err));
  }

  return (
    <div className="DisplayNote" style={{ padding: "1em" }}>
      <h1>New Note</h1>
      <input
        onKeyPress={(e) => {
          if (e.key === "Enter") handleSave();
        }}
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        className="toDoBtns"
        style={{ width: "80%", borderRadius: "6px" }}
        type="text"
      />
      <button
        onClick={handleSave}
        className="toDoBtns"
        style={{
          border: "1px solid grey",
          borderRadius: "5px",
          padding: "0.3em",
          width: "10%",
          background: "#d7fc5b",
        }}
      >
        Save
      </button>
    </div>
  );
};

export default CreateNote;
