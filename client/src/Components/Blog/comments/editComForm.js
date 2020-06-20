import React, { useState } from "react";
import axios from "axios";

const EditCommForm = ({
  commentId,
  show,
  setShow,
  text,
  userToken,
  load,
  setLoad,
}) => {
  const [newComment, setNewComment] = useState(text);

  function onSave() {
    if (newComment.length < 3)
      return alert("A comment need to be at least 3 characters");
    let body = {
      commentId,
      newComment,
    };
    const config = {
      headers: { Authorization: `Bearer ${userToken}` },
    };

    axios
      .post("/blog/comments/update", body, config)
      .then((res) => {
        setShow(false);
        setLoad(!load);
      })
      .catch((err) => console.error(err));
  }

  return (
    <div
      style={{
        animationName: show ? "editIn" : "editOut",
        animationDuration: "1.8s",
        visibility: show ? "visible" : "hidden",
        transition: "visibility 1.8s",
      }}
      id="EditCommForm"
    >
      <textarea
        style={{
          marginBottom: "0.3em",
          resize: "none",
          borderRadius: "5px",
          padding: "0.3em",
        }}
        cols="30"
        rows="5"
        value={newComment}
        placeholder={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <div>
        <button onClick={onSave}>Ok</button>{" "}
        <button
          onClick={() => {
            setShow(!show);
            setNewComment(text);
          }}
        >
          Cansel
        </button>
      </div>
    </div>
  );
};

export default EditCommForm;
