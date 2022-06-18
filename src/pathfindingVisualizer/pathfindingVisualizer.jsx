import React, { useState, useEffect } from "react";
import "./pathfindingVisualizer.css";
import Node from "./Node/node";
import NavBar from "./navbar";

import {
  breadthFirstSearch,
  getNodesInShortestPathOrderBFS,
} from "../pathfindingAlgorithms/breadthFirstSearch";
import {
  depthFirstSearch,
  getNodesInShortestPathOrderDFS,
} from "../pathfindingAlgorithms/depthFirstSearch";

//Maze Algorithms
import { randomMaze } from "../mazeAlgorithms/randomMaze";
import { verticalMaze } from "../mazeAlgorithms/verticalMaze";
import { horizontalMaze } from "../mazeAlgorithms/horizontalMaze";

//get number of rows and columns based on windows width
// finds row and column of grid according to screen dimensions
const [initialNumRows, initialNumColumns] = getInitialNum(
  window.innerWidth,
  window.innerHeight
);

//find random source and destination
let [startNodeRow, startNodeCol, finishNodeRow, finishNodeCol] =
  getStartFinishNode(initialNumRows, initialNumColumns);

const PathfindingVisualizer = () => {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [visualizingAlgorithm, setVisualizingAlgorithm] = useState(false);
  const [generatingMaze, setGeneratingMaze] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [numRows, setNumRows] = useState(initialNumRows);
  const [numColumns, setNumColumns] = useState(initialNumColumns);
  const [speed, setSpeed] = useState(10);
  const [mazeSpeed, setMazeSpeed] = useState(10);

  //useEffect
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    setGrid(getInitialGrid(numRows, numColumns));
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [numRows, numColumns, width]);

  const updateDimensions = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  const updateSpeed = (path, maze) => {
    setSpeed(path);
    setMazeSpeed(maze);
  };

  //when click mouse button wall created
  const handleMouseDown = (row, col) => {
    const newGrid = getNewGridWithWalls(grid, row, col);
    setGrid(newGrid);
    setMouseIsPressed(true);
  };

  //when mouse button is pressed and we moving our cursor then wall is created
  const handleMouseEnter = (row, col) => {
    if (mouseIsPressed) {
      const newGrid = getNewGridWithWalls(grid, row, col);
      setGrid(newGrid);
      setMouseIsPressed(true);

    }
  };

  //when release mouse button
  const handleMouseUp = () => {
    setMouseIsPressed(false);
    
  };

  const clearGrid = () => {
    if (visualizingAlgorithm || generatingMaze) {
      return;
    }
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        if (
          !(
            (row === startNodeRow && col === startNodeCol) ||
            (row === finishNodeRow && col === finishNodeCol)
          )
        ) {
          //each cell is div so we add the default class inital class-node
          document.getElementById(`node-${row}-${col}`).className = "node";
        }
      }
    }
    const newGrid = getInitialGrid(numRows, numColumns);
    //making new grid and and assigning it to main grid
    setGrid(newGrid);
    setVisualizingAlgorithm(false);
    setGeneratingMaze(false);
  };

  const clearPath = () => {
    if (visualizingAlgorithm || generatingMaze) {
      return;
    }
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        // only those cell which are traversed becomes default cell again without distubing the walls
        if (
          document.getElementById(`node-${row}-${col}`).className ===
          "node node-shortest-path"
        ) {
          document.getElementById(`node-${row}-${col}`).className = "node";
        }
      }
    }
    const newGrid = getGridWithoutPath(grid);
    setGrid(newGrid);
    setVisualizingAlgorithm(false);
    setGeneratingMaze(false);
  };

  //print shortest path
  const animateShortestPath = (
    nodesInShortestPathOrder,
    visitedNodesInOrder
  ) => {
    //if only one node is present i.e start and finish is same
    if (nodesInShortestPathOrder.length === 1) setVisualizingAlgorithm(false);
    //except the start node
    for (let i = 1; i < nodesInShortestPathOrder.length; i++) {
      //if we reach finish node and we
      if (i === nodesInShortestPathOrder.length - 1) {
        //after printing path we render the nodes if we make walls it is ok
        //but if we rmove walls the it will restore its properties of animation
        setTimeout(() => {
          let newGrid = updateNodesForRender(
            grid,
            nodesInShortestPathOrder,
            visitedNodesInOrder
          );
          setGrid(newGrid);
          setVisualizingAlgorithm(false);
        }, i * (3 * speed));
        return;
      }
      let node = nodesInShortestPathOrder[i];
      setTimeout(() => {
        //shortest path node
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, i * (3 * speed));
    }
  };

  //all visited nodes and nodes in shortest path
  const animateAlgorithm = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    let newGrid = grid.slice();
    for (let row of newGrid) {
      for (let node of row) {
        let newNode = {
          ...node,
          isVisited: false,
        };
        newGrid[node.row][node.col] = newNode;
      }
    }
    setGrid(newGrid);
    for (let i = 1; i <= visitedNodesInOrder.length; i++) {
      let node = visitedNodesInOrder[i];
      //if we reach the finish node then start animate shortest path route and stop the animate algo fun
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder, visitedNodesInOrder);
        }, i * speed);
        return;
      }
      setTimeout(() => {
        //visited node
        // just add class node-visited into div to for animation
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, i * speed);
    }
  };

  function visualizeBFS() {
    if (visualizingAlgorithm || generatingMaze) {
      return;
    }
    setVisualizingAlgorithm(true);
    setTimeout(() => {
      const startNode = grid[startNodeRow][startNodeCol];
      const finishNode = grid[finishNodeRow][finishNodeCol];
      const visitedNodesInOrder = breadthFirstSearch(
        grid,
        startNode,
        finishNode
      );
      const nodesInShortestPathOrder =
        getNodesInShortestPathOrderBFS(finishNode);
      animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
    }, speed);
  }

  function visualizeDFS() {
    if (visualizingAlgorithm || generatingMaze) {
      return;
    }
    setVisualizingAlgorithm(true);
    setTimeout(() => {
      const startNode = grid[startNodeRow][startNodeCol];
      const finishNode = grid[finishNodeRow][finishNodeCol];
      const visitedNodesInOrder = depthFirstSearch(grid, startNode, finishNode);
      const nodesInShortestPathOrder =
        getNodesInShortestPathOrderDFS(finishNode);
      animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
    }, speed);
  }

  //animation for walls
  const animateMaze = (walls) => {
    for (let i = 0; i <= walls.length; i++) {
      if (i === walls.length) {
        setTimeout(() => {
          clearGrid();
          let newGrid = getNewGridWithMaze(grid, walls);
          setGrid(newGrid);
          setGeneratingMaze(false);
        }, i * mazeSpeed);
        return;
      }
      let wall = walls[i];
      let node = grid[wall[0]][wall[1]];
      setTimeout(() => {
        //Walls
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-wall-animated";
      }, i * mazeSpeed);
    }
  };

  function generateRandomMaze() {
    if (visualizingAlgorithm || generatingMaze) {
      return;
    }
    setGeneratingMaze(true);
    setTimeout(() => {
      const startNode = grid[startNodeRow][startNodeCol];
      const finishNode = grid[finishNodeRow][finishNodeCol];
      const walls = randomMaze(grid, startNode, finishNode);
      animateMaze(walls);
    }, mazeSpeed);
  }

  function generateVerticalMaze() {
    if (visualizingAlgorithm || generatingMaze) {
      return;
    }
    setGeneratingMaze(true);
    setTimeout(() => {
      const startNode = grid[startNodeRow][startNodeCol];
      const finishNode = grid[finishNodeRow][finishNodeCol];
      const walls = verticalMaze(grid, startNode, finishNode);
      animateMaze(walls);
    }, mazeSpeed);
  }

  function generateHorizontalMaze() {
    if (visualizingAlgorithm || generatingMaze) {
      return;
    }
    setGeneratingMaze(true);
    setTimeout(() => {
      const startNode = grid[startNodeRow][startNodeCol];
      const finishNode = grid[finishNodeRow][finishNodeCol];
      const walls = horizontalMaze(grid, startNode, finishNode);
      animateMaze(walls);
    }, mazeSpeed);
  }

  return (
    <React.Fragment>
      <NavBar
        visualizingAlgorithm={visualizingAlgorithm}
        generatingMaze={generatingMaze}
        visualizeBFS={visualizeBFS}
        visualizeDFS={visualizeDFS}
        generateRandomMaze={generateRandomMaze}
        generateVerticalMaze={generateVerticalMaze}
        generateHorizontalMaze={generateHorizontalMaze}
        clearGrid={clearGrid}
        clearPath={clearPath}
        updateSpeed={updateSpeed}
      />

      <div class="d-flex flex-row flex-wrap m-2 justify-content-around">
        <div class="d-flex p-2">
          <div class="key wall"></div>
          <div> Wall</div>
        </div>
        <div class="d-flex p-2">
          <div class="key start"></div>
          <div>Start</div>
        </div>
        <div class="d-flex p-2">
          <div class="key end"></div>
          <div>Target</div>
        </div>
        <div class="d-flex p-2">
          <div class="key visited"></div>
          <div>Visited</div>
        </div>
        <div class="d-flex p-2">
          <div class="key success"></div>
          <div>Shortest-Path</div>
        </div>
        <div class="d-flex p-2">
          <div class="key"></div>
          <div>Unvisited</div>
        </div>
      </div>

      <div
        className={
          visualizingAlgorithm || generatingMaze ? "grid-visualizing" : "grid"
        }
      >
        {grid.map((row, rowId) => {
          return (
            <div key={rowId}>
              {row.map((node, nodeId) => {
                const {
                  row,
                  col,
                  isStart,
                  isFinish,
                  isVisited,
                  isShortest,
                  isWall,
                } = node;
                return (
                  <Node
                    key={nodeId}
                    row={row}
                    col={col}
                    isStart={isStart}
                    isFinish={isFinish}
                    isVisited={isVisited}
                    isShortest={isShortest}
                    isWall={isWall}
                    onMouseDown={(row, col) => handleMouseDown(row, col)}
                    onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                    onMouseUp={() => handleMouseUp()}
                    width={width}
                    height={height}
                    numRows={numRows}
                    numColumns={numColumns}
                  ></Node>
                );
              })}
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};

// finding rows and columns accoding to width and height
function getInitialNum(width, height) {
  let numColumns;
  if (width > 1500) {
    numColumns = Math.floor(width / 25);
  } else if (width > 1250) {
    numColumns = Math.floor(width / 22.5);
  } else if (width > 1000) {
    numColumns = Math.floor(width / 20);
  } else if (width > 750) {
    numColumns = Math.floor(width / 17.5);
  } else if (width > 500) {
    numColumns = Math.floor(width / 15);
  } else if (width > 250) {
    numColumns = Math.floor(width / 12.5);
  } else if (width > 0) {
    numColumns = Math.floor(width / 10);
  }
  let cellWidth = Math.floor(width / numColumns);
  let numRows = Math.floor(height / cellWidth);
  return [numRows, numColumns];
}

//function to find random source and destnation nodes
function getStartFinishNode(numRows, numColumns) {
  //starting node is always in top-left part
  let startNodeRow = Math.floor(Math.random() * (numRows / 2)) + 1; //added 1 to prevent out of bounds
  let startNodeCol = Math.floor(Math.random() * (numColumns / 2)) + 1;

  //finishing node is always in bottom-right part
  let finishNodeRow =
    Math.floor(numRows / 2) + Math.floor(Math.random() * (numRows / 2)) - 1;
  let finishNodeCol =
    Math.floor(numColumns / 2) +
    Math.floor(Math.random() * (numColumns / 2)) -
    1;

  return [startNodeRow, startNodeCol, finishNodeRow, finishNodeCol];
}

//creating grid
const getInitialGrid = (numRows, numColumns) => {
  let grid = [];
  for (let row = 0; row < numRows; row++) {
    let currentRow = [];
    for (let col = 0; col < numColumns; col++) {
      currentRow.push(createNode(row, col));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (row, col) => {
  return {
    row,
    col,
    isStart: row === startNodeRow && col === startNodeCol,
    isFinish: row === finishNodeRow && col === finishNodeCol,
    distance: Infinity,
    totalDistance: Infinity,
    isVisited: false,
    isShortest: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWalls = (grid, row, col) => {
  let newGrid = grid.slice(); //copy the old grid
  let node = grid[row][col]; //updating node's wall
  let newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithMaze = (grid, walls) => {
  let newGrid = grid.slice();
  for (let wall of walls) {
    let node = grid[wall[0]][wall[1]];
    let newNode = {
      ...node,
      isWall: true,
    };
    newGrid[wall[0]][wall[1]] = newNode;
  }
  return newGrid;
};

const getGridWithoutPath = (grid) => {
  let newGrid = grid.slice(); //copy the old grid
  for (let row of grid) {
    // removing paths from each cell of grid
    for (let node of row) {
      let newNode = {
        ...node,
        distance: Infinity,
        totalDistance: Infinity,
        isVisited: false,
        isShortest: false,
        previousNode: null,
      };
      newGrid[node.row][node.col] = newNode;
    }
  }
  return newGrid;
};

const updateNodesForRender = (
  grid,
  nodesInShortestPathOrder,
  visitedNodesInOrder
) => {
  let newGrid = grid.slice();
  //after printing path we render the nodes if we make walls it is ok
  //but if we rmove walls the it will restore its properties of animation
  for (let node of visitedNodesInOrder) {
    if (
      (node.row === startNodeRow && node.col === startNodeCol) ||
      (node.row === finishNodeRow && node.col === finishNodeCol)
    )
      continue;
    let newNode = {
      ...node,
      isVisited: true,
    };
    newGrid[node.row][node.col] = newNode;
  }
  for (let node of nodesInShortestPathOrder) {
    if (node.row === finishNodeRow && node.col === finishNodeCol) {
      return newGrid;
    }
    let newNode = {
      ...node,
      isVisited: false,
      isShortest: true,
    };
    newGrid[node.row][node.col] = newNode;
  }
};

export default PathfindingVisualizer;
