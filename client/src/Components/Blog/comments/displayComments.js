import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DataContext } from "../../../DataContext";

import "./comStyles.css";
import NewComment from "./newComment";
import dj from "../../Icons/dj.png";
import CrudButtons from "./crudButtons";

const DisplayComments = ({ openPanel }) => {
  const [comments, setComments] = useState([]);
  const [load, setLoad] = useState(false);
  const { userData, userToken } = useContext(DataContext);
  const [animate, setAnimate] = useState(true);

  //get all comments for the post
  useEffect(() => {
    function unsub() {
      const body = {
        postId: openPanel,
      };
      axios
        .post("/blog/comments/showcomments", body)
        .then((res) => {
          setComments(res.data);
        })
        .catch((err) => console.error(err));
    }
    return unsub();
  }, [openPanel, load]);

  return (
    <div className="commentDiv">
      <div id="writeCommentDiv">
        {userData ? (
          <NewComment load={load} setLoad={setLoad} openPanel={openPanel} />
        ) : (
          ""
        )}
      </div>
      {comments.map((each) => (
        <div
          id="displayCommentDiv"
          style={{
            animationDuration: "1s",
            animationName: animate ? "commentIn" : "commentOut",
          }}
          key={each._id}
        >
          <div id="commentAuthorInfo">
            <img
              style={{
                transform: "translateY(2.5px)",
                borderRadius: "12px",
                height: "25px",
                width: "25px",
              }}
              src={
                each.authorPic !== undefined && each.authorPic.length > 0
                  ? each.authorPic
                  : dj
              }
              alt=""
            />
            <p>From: {each.authorName}</p>
            <div id="crudDiv" style={{ display: "flex" }}>
              <p>
                {each.createdAt
                  .replace("T", " ")
                  .slice(0, -5)
                  .split(" ")
                  .reverse()
                  .join(" ")}
              </p>
              {userData && userData._id === each.authorId ? (
                <CrudButtons
                  userToken={userToken}
                  userId={userData._id}
                  commentId={each._id}
                  load={load}
                  setLoad={setLoad}
                  text={each.body}
                  setAnimate={setAnimate}
                />
              ) : (
                ""
              )}
            </div>
          </div>
          <textarea
            disabled
            id="displayComments"
            value={each.body}
            cols="50"
            rows="5"
          ></textarea>
        </div>
      ))}
    </div>
  );
};

export default DisplayComments;
