import React, { useState } from "react";
import { useTransition, animated } from "react-spring";

//localComponents
import CheckBox from "./Buttons/CheckBox";
import NoteOptions from "./Buttons/NoteOptions";
import AnimatedH3 from "./Animated/AnimatedH3";

const AnimatedList = ({ each, sellectedList }) => {
  const [highlighter, setHighlighter] = useState(each.important);
  const [show, setShow] = useState(true);

  const transitions = useTransition(show, null, {
    from: { transform: "translate3d(0,-470px,0)", opacity: 0.4 },
    enter: { transform: "translate3d(0,0,0)", opacity: 1 },
    leave: { transform: "translate3d(0,470px,0)" },
    config: { mass: 3.1, tension: 194, friction: 27 },
  });

  return transitions.map(
    ({ item, key, props }) =>
      item && (
        <animated.div key={key} style={props}>
          <div
            className="ToDoTask"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              background: "lightgreen",
              padding: "0.5em",
              border: "0.8px solid grey",
              margin: "1.5px 0",
              borderRadius: "2.5px",
              flexWrap: "wrap",
            }}
          >
            <div
              className="toDoItems"
              style={{
                width: "5%",
              }}
            >
              <CheckBox each={each} sellectedList={sellectedList} />
            </div>
            <p className="toDoItems" style={{ width: "15%" }}>
              {each.createdAt.replace("T", " ").slice(0, -5)}
            </p>
            {each.important ? (
              <AnimatedH3 text={each.text} highlighter={highlighter} />
            ) : (
              <h3
                className="toDoItems"
                style={{
                  display: "block",
                  width: "60%",
                  textDecoration: each.isDone
                    ? "line-through wavy red"
                    : "none",
                  color: each.isDone ? "grey" : "black",
                }}
              >
                {each.text}
              </h3>
            )}
            <NoteOptions
              highlighter={highlighter}
              setHighlighter={setHighlighter}
              show={show}
              setShow={setShow}
              each={each}
              sellectedList={sellectedList}
            />
          </div>
        </animated.div>
      )
  );
};

export default AnimatedList;
