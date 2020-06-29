import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";

//Text Editor
import {
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  AtomicBlockUtils,
} from "draft-js";
import Editor from "draft-js-plugins-editor";
// Plugins
import createVideoPlugin from "draft-js-video-plugin";
import createImagePlugin from "draft-js-image-plugin";

//Local Components

import ToolBar from "./Components/ToolBar";
import { styleMap } from "./Components/StyleMap";

const Wraper = styled.div`
  border-top: solid 1px black;
  margin-bottom: 1em;
  padding: 0.1em;
`;
const DivInner = styled.div`
  background: #f7f7f7;
  width: 85%;
  padding: 1em;
  /* text-align: left; */
  margin: 0.5em auto;

  min-height: 18em;
`;

//component

const ForEditText = (props) => {
  //plugins
  const imagePlugin = createImagePlugin();
  const videoPlugin = createVideoPlugin();

  //initialize text editor
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(convertFromRaw(props.each.postText))
  );

  // Set Focus on the editor Div
  const editor = React.useRef(null);

  function focusEditor() {
    editor.current.focus();
  }

  React.useEffect(() => {
    focusEditor();
  }, []);

  //Allow keyboard to toggle styles
  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  //when editor state is change
  useEffect(() => {
    props.setPostText(convertToRaw(editorState.getCurrentContent()));
  }, [editorState]);

  // Upload Image
  // -----------------------------------------------
  //  needed for UploadTools
  const insertImage = (editorState, base64) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "image",
      "IMMUTABLE",
      { src: base64 }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });
    return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ");
  };

  const handleDisplay = (converted64) => {
    const base64 = converted64;
    const newEditorState = insertImage(editorState, base64);
    setEditorState(newEditorState);
  };
  //--------------------------------------------------

  return (
    <React.Fragment>
      <Wraper>
        <ToolBar
          editorState={editorState}
          setEditorState={setEditorState}
          imagePlugin={imagePlugin}
          videoPlugin={videoPlugin}
          setPostText={props.setPostText}
          handleDisplay={handleDisplay}
        />
        <DivInner className="newPostEditor" onClick={focusEditor}>
          <Editor
            spellCheck={true}
            ref={editor}
            customStyleMap={styleMap}
            editorState={editorState}
            onChange={setEditorState}
            handleKeyCommand={handleKeyCommand}
            plugins={[imagePlugin, videoPlugin]}
          />
        </DivInner>
      </Wraper>
    </React.Fragment>
  );
};

export default ForEditText;
