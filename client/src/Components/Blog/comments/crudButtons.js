import React, { useState } from "react";
import axios from "axios";
import { EditOutlined } from "@ant-design/icons";
import EditCommForm from "./editComForm";

const CrudButtons = ({
  commentId,
  userId,
  userToken,
  load,
  setLoad,
  text,
  setAnimate,
}) => {
  const [show, setShow] = useState(false);

  async function handleDel() {
    let body = {
      commentId,
      userId,
    };

    const config = {
      headers: { Authorization: `Bearer ${userToken}` },
    };

    await axios
      .post("http://localhost:5000/blog/comments/delUserComment", body, config)
      .then(() => {
        setAnimate(false);
        setLoad(!load);
        setTimeout(() => {
          setAnimate(true);
        }, 650);
      })
      .catch((err) => console.error(err));
  }

  return (
    <>
      <EditCommForm
        text={text}
        show={show}
        setShow={setShow}
        userToken={userToken}
        load={load}
        setLoad={setLoad}
        commentId={commentId}
      />
      <div>
        <button
          onClick={() => setShow(!show)}
          id="editComment"
          className="ComBtnStyle"
        >
          <EditOutlined />
        </button>
        <button onClick={handleDel} id="delComment" className="ComBtnStyle">
          X
        </button>
      </div>
    </>
  );
};

export default CrudButtons;
