import React from "react";
import { EditorState, convertFromRaw } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createImagePlugin from "draft-js-image-plugin";
import createVideoPlugin from "draft-js-video-plugin";
import { styleMap } from "./Components/StyleMap";
import { createLinkDecorator } from "./Components/Link";

const DisplayEditor = (props) => {
  const imagePlugin = createImagePlugin();
  const videoPlugin = createVideoPlugin();
  const decorator = createLinkDecorator();

  const editorState = props.postData
    ? EditorState.createWithContent(convertFromRaw(props.postData), decorator)
    : EditorState.createEmpty();

  return (
    <div>
      <div className="displayEditor" style={{ color: "#424242" }}>
        <Editor
          customStyleMap={styleMap}
          editorState={editorState}
          readOnly={true}
          plugins={[imagePlugin, videoPlugin]}
        />
      </div>
    </div>
  );
};

export default DisplayEditor;
