import React from "react";
import { useTransition, animated } from "react-spring";

const NoteText = ({ text, isDone, important }) => {
  const transitions = useTransition(text, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 4000 },
  });

  return (
    <>
      <button onClick={() => console.log(text)}>Click</button>
      <h3
        className="toDoItems"
        style={{
          display: "block",
          width: "60%",
          textDecoration: isDone ? "line-through wavy red" : "none",
          color: isDone ? "grey" : "black",
          background: important ? "yellow" : "inherit",
          borderRadius: "8px",
          fontSize: important ? "130%" : "120%",
        }}
      >
        {transitions.map(({ item, props }) => (
          <animated.div style={props}>{item}</animated.div>
        ))}
      </h3>
    </>
  );
};

export default NoteText;
