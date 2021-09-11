import React from "react";
import "./node.css";

const Node = (props) => {
  const {
    row,
    col,
    isStart,
    isFinish,
    isWall,
    isVisited,
    isShortest,
    onMouseEnter,
    onMouseDown,
    onMouseUp,
    width,
    height,
    numRows,
    numColumns,
  } = props;

  const extraClass = isStart
    ? "node node-start"
    : isFinish
    ? "node node-finish"
    : isWall
    ? "node-wall"
    : isShortest
    ? "node node-shortest-path"
    : isVisited
    ? "node node-visited"
    : "node";

  // FINDING CELL WIDTH AND HEIGHT FOR STYLING
  let cellWidth = Math.floor((width - 100) / numColumns);
  let cellHeight;
  if (width > 1500) {
    cellHeight = Math.floor((height - 150) / numRows);
  } else if (width > 1000) {
    cellHeight = Math.floor((height - 70) / numRows);
  } else if (width > 500) {
    cellHeight = Math.floor((height - 60) / numRows);
  } else if (width > 0) {
    cellHeight = Math.floor((height - 50) / numRows);
  }

  return (
    // making each cell as div
    <div
      id={`node-${row}-${col}`}
      className={`${extraClass}`}
      style={{
        "--width": `${cellWidth}px`,
        "--height": `${cellHeight}px`,
        borderLeft: col !== 0 && 0,
        borderTop: row !== 0 && 0,
      }}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseUp={() => onMouseUp()}
    ></div>
  );
};

export default Node;
