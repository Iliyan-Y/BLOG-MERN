import React, { useState, useContext, useEffect } from "react";
import { Layout, Card, Button, Space } from "antd";
import axios from "axios";

//local
import { DataContext } from "../../DataContext";
import ForEditText from "./TextEditor/ForEditText";
import UploadImg from "./UploadImg";

//local

const EditPost = (props) => {
  const [postTitle, setPostTitle] = useState("");
  const [postDescr, setPostDescr] = useState("");
  const [postText, setPostText] = useState();
  const { reRender, setReRender, userToken } = useContext(DataContext);
  const [base64Img, setBase64Img] = useState(props.each.thumb);
  const [isPublic, setPublic] = useState(true);
  const [tags, setTags] = useState("");

  const { Content } = Layout;

  useEffect(() => {
    function unsub() {
      if (props.edit) {
        setPostDescr(props.each.description);
        setPostTitle(props.each.title);
        setTags(props.each.tags.toString());
      }
    }
    unsub();
  }, [props.edit]);

  const handleSubmit = () => {
    const config = {
      headers: { Authorization: `Bearer ${userToken}` },
    };

    const newPost = {
      title: postTitle,
      description: postDescr,
      postText: postText,
      thumb: base64Img,
      public: isPublic,
      tags: addTags(),
    };

    axios
      .post(
        `http://localhost:5000/apps/blog/update/${props.each._id}`,
        newPost,
        config
      )
      .then(() => {
        setPostTitle("");
        setPostDescr("");
        setReRender(!reRender);
        props.setEdit(false);
      })
      .catch((err) => {
        alert(
          `${err}! Please check if all the fields are completed and have max length of => Title: 250, Description: 500; Min length for the Post is 12 characters.`
        );
      });
  };

  const addTags = () => {
    // get the string tag convert to lowerCase, remove the spacem and convert to array
    let tagsToArray = tags.toLowerCase().replace(/\s/g, "").split(",");
    //remove the empty array value
    tagsToArray = tagsToArray.filter((noSpace) => /\S/.test(noSpace));
    return tagsToArray;
  };

  return (
    <Content style={{ margin: "0 16px" }}>
      <div
        className="site-layout-background"
        style={{ padding: 24, minHeight: 360, textAlign: "center" }}
      >
        <div style={{ textAlign: "center" }}>
          <Card title="New post">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <input
                required
                style={{
                  width: "70%",
                  padding: "0.3em",
                  margin: "1em auto",
                  borderRadius: "6px",
                }}
                type="text"
                placeholder={"Title"}
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
              />
              <h3>Thumbnail</h3>
              <UploadImg base64Img={base64Img} setBase64Img={setBase64Img} />
              <textarea
                required
                style={{
                  width: "70%",
                  padding: "0.3em",
                  margin: "1em auto",
                  resize: "none",
                  borderRadius: "6px",
                }}
                placeholder={"Description"}
                cols="8"
                rows="3"
                value={postDescr}
                onChange={(e) => setPostDescr(e.target.value)}
              />

              <ForEditText
                each={props.each}
                postText={postText}
                setPostText={setPostText}
                edit={props.edit}
              />

              <div
                className="PostButtons"
                style={{
                  display: "flex",
                  margin: "0.5em auto",
                  width: "65%",
                  height: "2.2em",
                }}
              >
                <p>Separate by " , " exaple: React js, Node, etc.., </p>
                <input
                  id="TagInput"
                  style={{ width: "75%", borderRadius: "4px" }}
                  type="text"
                  name="Tags"
                  placeholder={tags.length > 0 ? tags : "Add Tags"}
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <div>
                <Space>
                  <label htmlFor="save">Save as:</label>
                  <select onChange={(e) => setPublic(e.target.value)} id="save">
                    <option value={true}>Public</option>
                    <option value={false}>Draft</option>
                  </select>
                  <Button
                    onClick={handleSubmit}
                    style={{ background: "orange", borderRadius: "8px" }}
                  >
                    Submit
                  </Button>
                  <Button
                    onClick={() => props.setEdit(false)}
                    style={{ background: "pink", borderRadius: "8px" }}
                  >
                    Cancel
                  </Button>
                </Space>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Content>
  );
};

export default EditPost;
