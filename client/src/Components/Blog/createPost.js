import React, { useRef, useState, useContext, useEffect } from "react";
import { Layout, Card, Button } from "antd";
import { useHistory } from "react-router-dom";
import axios from "axios";

//local
import PlugTextEditor from "./TextEditor/PlugTextEditor";
import UploadImg from "./UploadImg";
import { DataContext } from "../../DataContext";

const CreatePost = () => {
  const goTo = useHistory();
  const [postTitle, setPostTitle] = useState("");
  const [postDescr, setPostDescr] = useState("");
  const [postText, setPostText] = useState();
  const [base64Img, setBase64Img] = useState();
  const { setCurrentOpenPage, userData, userToken } = useContext(DataContext);
  const [isPublic, setPublic] = useState(false);
  const [tags, setTags] = useState();

  const { Content } = Layout;

  const handleSubmit = () => {
    const config = {
      headers: { Authorization: `Bearer ${userToken}` },
    };
    const newPost = {
      title: postTitle,
      description: postDescr,
      postText,
      thumb: base64Img,
      authorName: userData ? userData.name : "",
      author: userData._id,
      public: isPublic,
      tags: addTags(),
    };
    axios
      .post("/apps/blog/newPost", newPost, config)
      .then(() => {
        setPostTitle("");
        setPostDescr("");
        setCurrentOpenPage("/user/blog");
        goTo.push("/user/blog");
      })
      .catch((err) =>
        alert(
          `${err}! Please check if all the fields are completed and have max length of => Title: 250, Description: 500; Min length for the Post is 12 characters.`
        )
      );
  };

  const addTags = () => {
    if (tags) {
      // get the string tag convert to lowerCase, remove the spacem and convert to array
      let tagsToArray = tags.toLowerCase().replace(/\s/g, "").split(",");
      //remove the empty array value
      tagsToArray = tagsToArray.filter((noSpace) => /\S/.test(noSpace));
      return tagsToArray;
    }
  };

  //set event to alert before window is closed
  const useUnload = (fn) => {
    const cb = useRef(fn);

    useEffect(() => {
      const onUnload = cb.current;

      window.addEventListener("beforeunload", onUnload);

      return () => window.removeEventListener("beforeunload", onUnload);
    }, [cb]);
  };

  useUnload((e) => {
    e.preventDefault();
    e.returnValue = "";
  });

  // // //autosave the post after 10min
  // useEffect(() => {
  //   function un() {
  //     setTimeout(() => {}, 9000); //600000
  //   }
  //   return un();
  // }, []);

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
                justifyContent: "center",
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
                placeholder="Title"
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
                placeholder="Description"
                cols="8"
                rows="3"
                value={postDescr}
                onChange={(e) => setPostDescr(e.target.value)}
              />

              <PlugTextEditor postText={postText} setPostText={setPostText} />

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
                  placeholder="Tags"
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <div className="PostButtons" style={{ margin: "1em" }}>
                <label>Save as:</label>
                {"  "}
                <select
                  defaultValue={false}
                  onChange={(e) => setPublic(e.target.value)}
                  id="save"
                >
                  <option value={true}>Public</option>
                  <option value={false}>Draft</option>
                </select>
                {"    "}
                <Button
                  onClick={handleSubmit}
                  style={{ background: "orange", borderRadius: "8px" }}
                >
                  Save
                </Button>
                {"  "}
                <Button
                  onClick={() => {
                    goTo.push("/user/blog");
                  }}
                  style={{ background: "pink", borderRadius: "8px" }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Content>
  );
};

export default CreatePost;
