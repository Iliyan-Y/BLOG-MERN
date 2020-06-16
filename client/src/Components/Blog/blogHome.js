import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

//antd
import { Collapse, Button } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

//local
import { DataContext } from "../../DataContext";

import DisplayEditor from "./TextEditor/DisplayEditor";
import DisplayComments from "./comments/displayComments";

const { Panel } = Collapse;

const BlogHome = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [tags, setTags] = useState("");
  const { setCurrentOpenPage, userData, reRender, setReRender } = useContext(
    DataContext
  );
  const [openPanel, setOpenPanel] = useState(null);
  const [panelDisabled, setPanelDisabled] = useState(false);
  const goTo = useHistory();

  //convert tags to array
  const addTags = () => {
    let tagsToArray = tags.toLowerCase().replace(/\s/g, "").split(",");
    tagsToArray = tagsToArray.filter((noSpace) => /\S/.test(noSpace));
    return tagsToArray;
  };

  //Display the posts
  function getPost() {
    if (tags.length > 0) {
      const body = {
        tags: addTags(),
      };
      axios
        .post("http://localhost:5000/apps/blog/displayTags", body)
        .then((res) => {
          if (res.data.length > 0) {
            setAllPosts(res.data);
          }
        });
    } else {
      axios.get("http://localhost:5000/apps/blog").then((res) => {
        if (res.data.length > 0) {
          setAllPosts(res.data);
        }
      });
    }
  }

  useEffect(() => {
    function unsub() {
      getPost();
    }
    return unsub();
  }, [reRender]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ marginBottom: "0.8em" }}>
          <input
            onChange={(e) => setTags(e.target.value)}
            type="text"
            placeholder={`Tags: React, Node, etc...`}
          />{" "}
          <Button onClick={() => setReRender(!reRender)}>Search</Button>
        </div>
        <h1>Blog</h1>
        {userData ? (
          <div style={{ marginBottom: "1.2em" }}>
            <Button onClick={() => goTo.push("/createPost")}>New Post</Button>{" "}
            <Button onClick={() => goTo.push("/user/blog")}>My Posts</Button>{" "}
            <Button onClick={() => goTo.push("/toDoList")}>My Notes</Button>
          </div>
        ) : (
          <span style={{ width: "18%" }}></span>
        )}
      </div>

      <Collapse
        expandIconPosition="right"
        style={{ fontSize: "110%" }}
        bordered={false}
        onChange={(panel) => {
          if (openPanel === null) {
            setOpenPanel(panel.toString());
            setCurrentOpenPage(`/apps/blog/${panel.toString()}`);
            goTo.push(`/apps/blog/${panel.toString()}`);
          } else {
            setOpenPanel(null);
            setCurrentOpenPage("/apps/blog/");
            goTo.push(`/apps/blog/`);
          }
        }}
        activeKey={openPanel}
      >
        {/* Create panel for each post of the blog to be displayed */}
        {allPosts.map((each) => (
          <Panel
            disabled={panelDisabled}
            header={
              // Blog Title and Description starts here
              <div>
                {openPanel ? (
                  <div
                    style={{
                      display: "flex",
                      marginRight: "-2.4em",
                      justifyContent: "flex-end",
                    }}
                  ></div>
                ) : null}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {each.authorName ? (
                    <p id="AuthroP">
                      {/* <img src={each.img} /> */}
                      Author: {each.authorName}
                    </p>
                  ) : (
                    <div></div>
                  )}

                  <h1 style={{ marginBottom: "1em" }}>{each.title}</h1>
                  <div id="postedAt">
                    <p>
                      Published:{" "}
                      {each.createdAt
                        .replace("T", " ")
                        .slice(0, -14)
                        .split("-")
                        .reverse()
                        .join("-")}
                    </p>
                  </div>
                </div>

                <img
                  style={{ maxHeight: "240px", maxWidth: "85%" }}
                  src={each.thumb}
                  alt="thumbnail"
                />
                <p
                  style={{
                    marginBottom: "-14px",
                    color: openPanel !== each._id ? "grey" : "#424242",
                  }}
                >
                  {each.description}
                  {openPanel !== each._id ? <ArrowDownOutlined /> : ""}
                </p>
              </div>
            }
            key={each._id}
          >
            {/* Blog body starts here !  */}
            <div className="Container">
              <DisplayEditor postData={each.postText} />
            </div>
            <DisplayComments openPanel={openPanel} />
            <ArrowUpOutlined
              style={{ fontSize: "150%", padding: "0.5em" }}
              onClick={() => setOpenPanel(null)}
            />
            <p style={{ cursor: "pointer" }} onClick={() => setOpenPanel(null)}>
              Close
            </p>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default BlogHome;
