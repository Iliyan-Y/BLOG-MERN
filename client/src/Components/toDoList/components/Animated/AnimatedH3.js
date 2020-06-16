import React from "react";
import { useTransition, animated } from "react-spring";

const AnimatedH3 = ({ text, highlighter }) => {
  const transitions = useTransition(highlighter, null, {
    from: {
      background: "lightgreen",
      width: "15%",
      transform: "scale(0.7)",
    },
    enter: {
      background: "yellow",
      width: "100%",
      borderRadius: "8px",
      transform: "scale(1)",
    },
    leave: {
      background: "lightgreen",
      width: "15%",
      transform: "scale(0.7)",
    },
    config: { duration: 700 },
  });

  return transitions.map(
    ({ item, key, props }) =>
      item && (
        <div className="toDoItems" style={{ width: "60%" }}>
          <animated.h3 style={({ width: "100%" }, props)}>{text}</animated.h3>
        </div>
      )
  );
};

export default AnimatedH3;
