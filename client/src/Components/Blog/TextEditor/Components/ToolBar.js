import React from "react";
import { RichUtils } from "draft-js";
import styled from "@emotion/styled";
import { HighlightOutlined } from "@ant-design/icons";

//local
import AddVideo from "./addVideoBtn";
import ImageAdd from "./addImgBtn";
import UploadTool from "./UploadTool";

export const ToolBtn = styled.button`
  padding: 0.5em;
  width: 80px;
  border-radius: 12px;
  background: white;
  outline: none;
  margin: 0.1em;
  margin-top: 0.8em;
`;

const ToolBar = (props) => {
  // //Export editor data to be used for on display
  // const handleSubmit = () => {
  //   // setSaveData(JSON.stringify(convertToRaw(editorState.getCurrentContent())));

  //   props.setPostText(convertToRaw(props.editorState.getCurrentContent()));
  // };
  // // useEffect(() => {
  // //   console.log(props.saveData);
  // // }, [props.saveData]);

  //Create button functionality
  const handleItalic = () => {
    props.setEditorState(
      RichUtils.toggleInlineStyle(props.editorState, "ITALIC")
    );
  };

  const handleB = () => {
    props.setEditorState(
      RichUtils.toggleInlineStyle(props.editorState, "HIGHLIGHT")
    );
  };

  const handleBlockQ = () => {
    props.setEditorState(RichUtils.toggleInlineStyle(props.editorState, "QU"));
  };
  const handleBlockCode = () => {
    props.setEditorState(
      RichUtils.toggleInlineStyle(props.editorState, "CODE")
    );
  };
  const handleTitle = () => {
    props.setEditorState(RichUtils.toggleInlineStyle(props.editorState, "H1"));
  };
  const bold = () => {
    props.setEditorState(
      RichUtils.toggleInlineStyle(props.editorState, "BOLD")
    );
  };
  const handleH2 = () => {
    props.setEditorState(RichUtils.toggleInlineStyle(props.editorState, "H2"));
  };

  const isOn = (style) => {
    return props.editorState.getCurrentInlineStyle().has(style);
  };

  return (
    <div
      id="TextEditorToolBar"
      style={{
        position: "-webkit-sticky",
        position: "sticky",
        top: 0,
        display: "flex",
        width: "85%",
        margin: "0 auto",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          transform: "scale(0.95)",
        }}
      >
        <ToolBtn
          style={{ background: isOn("H1") ? "yellow" : "white" }}
          onClick={handleTitle}
        >
          H1
        </ToolBtn>
        <ToolBtn
          style={{ background: isOn("H2") ? "yellow" : "white" }}
          onClick={handleH2}
        >
          H2
        </ToolBtn>
        <ToolBtn
          style={{
            background: isOn("BOLD") ? "yellow" : "white",
            fontWeight: "bold",
          }}
          onClick={bold}
        >
          B
        </ToolBtn>
        <ToolBtn
          style={{
            background: isOn("ITALIC") ? "yellow" : "white",
            fontStyle: "italic",
          }}
          onClick={handleItalic}
        >
          It
        </ToolBtn>
        <ToolBtn
          style={{ background: isOn("HIGHLIGHT") ? "yellow" : "white" }}
          onClick={handleB}
        >
          <HighlightOutlined />
        </ToolBtn>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ToolBtn
          style={{
            background: isOn("QU") ? "yellow" : "white",
            fontFamily: "Chalkduster, fantasy",
          }}
          onClick={handleBlockQ}
        >
          "Quote"
        </ToolBtn>
        <ToolBtn
          style={{
            background: isOn("CODE") ? "yellow" : "white",
            fontFamily: "Consolas, monaco, monospace",
            color: "#3ceb02",
          }}
          onClick={handleBlockCode}
        >
          >Code
        </ToolBtn>
        <ImageAdd
          editorState={props.editorState}
          onChange={props.setEditorState}
          modifier={props.imagePlugin.addImage}
        />
        <AddVideo
          editorState={props.editorState}
          onChange={props.setEditorState}
          modifier={props.videoPlugin.addVideo}
        />

        <UploadTool handleDisplay={props.handleDisplay} />

        {/* <ToolBtn onClick={() => props.onAddLink()}>link</ToolBtn> */}
      </div>
    </div>
  );
};

export default ToolBar;
