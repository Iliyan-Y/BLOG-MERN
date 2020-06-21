import React from "react";
import { CompositeDecorator, EditorState, AtomicBlockUtils } from "draft-js";

const Link = ({ entityKey, contentState, children }) => {
  const { url } = contentState.getEntity(entityKey).getData();
  return (
    <a href={url} target="_blank">
      {children}
    </a>
  );
};

const findLinkEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();

    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
};

export const createLinkDecorator = () =>
  new CompositeDecorator([
    {
      strategy: findLinkEntities,
      component: Link,
    },
  ]);

// create the new editor state
const addLinkFn = (editorState, link) => {
  const decorator = createLinkDecorator();
  const contentState = editorState.getCurrentContent();

  const rawContentState = {
    "blocks": [
      {
        "key": "3echq",
        "text": "link",
        "type": "unstyled",
        "depth": 0,
        "inlineStyleRanges": [],
        "entityRanges": [{ "offset": 0, "length": 4, "key": 0 }],
        "data": {},
      },
    ],
    "entityMap": {
      "0": {
        "type": "LINK",
        "mutability": "MUTABLE",
        "data": { "url": "http://google.com" },
      },
    },
  };

  const contentStateWithEntity = contentState.createEntity("LINK", "MUTABLE", {
    url: link,
  });
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newEditorState = EditorState.set(editorState, {
    currentContent: contentStateWithEntity,
    decorator,
  });
  let displayText = () => {
    let name = window.prompt("Display Text");
    return name ? name : link;
  };
  return AtomicBlockUtils.insertAtomicBlock(
    newEditorState,
    entityKey,
    displayText()
  );
};

// call all together
export const onAddLink = (editorState, setEditorState) => {
  let link = window.prompt("Add link http:// ");
  if (link) {
    const newEditorState = addLinkFn(editorState, link);
    setEditorState(newEditorState);
  }
};
