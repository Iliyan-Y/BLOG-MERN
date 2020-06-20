import React, { useContext, useState } from "react";
import { Button } from "antd";
import axios from "axios";
import { DataContext } from "../../../DataContext";

const NewComment = ({ openPanel, load, setLoad }) => {
  const { userData, userToken } = useContext(DataContext);
  const [newComment, setNewComment] = useState("");

  function handlePost() {
    if (newComment.length < 3)
      return alert("A comment need to be at least 3 characters");

    if (userData) {
      let body = {
        postId: openPanel,
        text: newComment,
        authorName: userData.name,
        authorId: userData._id,
        authorPic: userData.img,
      };
      const config = {
        headers: { Authorization: `Bearer ${userToken}` },
      };

      axios
        .post("/blog/comments/new", body, config)
        .then((res) => {
          setNewComment("");
          setLoad(!load);
        })
        .catch((err) => console.error(err));
    }
  }

  return (
    <>
      <textarea
        onChange={(e) => setNewComment(e.target.value)}
        style={{ resize: "none" }}
        value={newComment}
        placeholder="Write a comment"
        cols="50"
        rows="5"
      ></textarea>
      <div>
        <Button onClick={handlePost}>Send</Button>
        <Button>Cancel</Button>
      </div>
    </>
  );
};

export default NewComment;
