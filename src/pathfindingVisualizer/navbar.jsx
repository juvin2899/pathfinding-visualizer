import React, { useState } from "react";
import "./navbar.css";

const brand = window.innerWidth > 600 ? "Pathfinding Visualizer" : "Pathfinder";

const NavBar = (props) => {
  const [algorithm, setAlgorithm] = useState("Visualize Algorithm");
  const [maze, setMaze] = useState("Generate Maze");
  const [pathState, setPathState] = useState(false); //whether there is path on grid
  const [mazeState, setMazeState] = useState(false); //whether there is maze on grid
  const [speedState, setSpeedState] = useState("Slow");

  function selectAlgorithm(selection) {
    //if one algorithm is running we cannot select and run another algorithm
    if (props.visualizingAlgorithm) {
      return;
    }
    if (
      selection === algorithm ||
      algorithm === "Visualize Algorithm" ||
      algorithm === "Select an Algorithm!"
    ) {
      setAlgorithm(selection);
    }
    //if new algo is selected the clear the prvious grid if it is traversed
    else if (pathState) {
      clearPath();
      setAlgorithm(selection);
    }
    //select algo
    else {
      setAlgorithm(selection);
    }
  }

  function selectMaze(selection) {
    if (props.visualizingAlgorithm || props.generatingMaze) {
      return;
    }
    if (
      selection === maze ||
      maze === "Generate Maze" ||
      maze === "Select a Maze!"
    ) {
      setMaze(selection);
    } else if (!mazeState) {
      setMaze(selection);
    } else {
      clearGrid();
      setMaze(selection);
    }
  }

  function visualizeAlgorithm() {
    if (props.visualizingAlgorithm || props.generatingMaze) {
      return;
    }
    //clear the already present path
    if (pathState) {
      clearTemp();
      return;
    }
    if (
      algorithm === "Visualize Algorithm" ||
      algorithm === "Select an Algorithm!"
    ) {
      setAlgorithm("Select an Algorithm!");
    } else {
      setPathState(true);
      if (algorithm === "Visualize Dijkstra") props.visualizeDijkstra();
      else if (algorithm === "Visualize Breadth First Search")
        props.visualizeBFS();
      else if (algorithm === "Visualize Depth First Search")
        props.visualizeDFS();
    }
  }

  function generateMaze() {
    if (props.visualizingAlgorithm || props.generatingMaze) {
      return;
    }
    // if somw path or walls already present the clear them first
    if (mazeState || pathState) {
      clearTemp();
    }
    if (maze === "Generate Maze" || maze === "Select a Maze!") {
      setMaze("Select a Maze!");
    } else {
      setMazeState(true);
      if (maze === "Generate Random Maze") props.generateRandomMaze();
      else if (maze === "Generate Recursive Maze")
        props.generateRecursiveDivisionMaze();
      else if (maze === "Generate Vertical Maze") props.generateVerticalMaze();
      else if (maze === "Generate Horizontal Maze")
        props.generateHorizontalMaze();
    }
  }

  function clearGrid() {
    if (props.visualizingAlgorithm || props.generatingMaze) {
      return;
    }
    props.clearGrid();
    setAlgorithm("Visualize Algorithm");
    setMaze("Generate Maze");
    setPathState(false);
    setMazeState(false);
  }

  //just clear the traversed path not walls
  function clearPath() {
    if (props.visualizingAlgorithm || props.generatingMaze) {
      return;
    }
    props.clearPath();
    setPathState(false);
    setMazeState(false);
  }

  //clear the complete grid
  function clearTemp() {
    if (props.visualizingAlgorithm || props.generatingMaze) {
      return;
    }
    props.clearGrid();
    setPathState(false);
    setMazeState(false);
  }

  function changeSpeed(speed) {
    if (props.visualizingAlgorithm || props.generatingMaze) {
      return;
    }
    let value = [10, 10];
    if (speed === "Slow") value = [50, 30];
    else if (speed === "Medium") value = [25, 20];
    else if (speed === "Fast") value = [10, 10];
    setSpeedState(speed);
    props.updateSpeed(value[0], value[1]);
  }

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <a className="navbar-brand h1 mb-0" href="/">
        {brand}
      </a>
      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item dropdown">
            <div className="dropdown">
              <a
                href="/#"
                className="nav-link dropdown-toggle"
                id="dropdownMenu1"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Algorithms
              </a>
              <div className="dropdown-menu" aria-labelledby="dropdownMenu1">
                <button
                  className="dropdown-item btn-light"
                  type="button"
                  onClick={() => selectAlgorithm("Visualize Dijkstra")}
                >
                  Dijkstra's Algorithm
                </button>

                <button
                  className="dropdown-item btn-light"
                  type="button"
                  onClick={() =>
                    selectAlgorithm("Visualize Breadth First Search")
                  }
                >
                  Breadth First Search
                </button>
                <button
                  className="dropdown-item btn-light"
                  type="button"
                  onClick={() =>
                    selectAlgorithm("Visualize Depth First Search")
                  }
                >
                  Depth First Search
                </button>
              </div>
            </div>{" "}
          </li>

          <li className="nav-item dropdown">
            <div className="dropdown">
              <a
                href="/#"
                className="nav-link dropdown-toggle"
                id="dropdownMenu1"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Mazes
              </a>
              <div className="dropdown-menu" aria-labelledby="dropdownMenu1">
                <button
                  className="dropdown-item btn-light"
                  type="button"
                  onClick={() => selectMaze("Generate Random Maze")}
                >
                  Random Maze
                </button>
                <button
                  className="dropdown-item btn-light"
                  type="button"
                  onClick={() => selectMaze("Generate Recursive Maze")}
                >
                  Recursive Division Maze
                </button>
                <button
                  className="dropdown-item btn-light"
                  type="button"
                  onClick={() => selectMaze("Generate Vertical Maze")}
                >
                  Vertical Division Maze
                </button>
                <button
                  className="dropdown-item btn-light"
                  type="button"
                  onClick={() => selectMaze("Generate Horizontal Maze")}
                >
                  Horizontal Division Maze
                </button>
              </div>
            </div>{" "}
          </li>

          <li className="nav-item dropdown">
            <div className="dropdown">
              <a
                href="/#"
                className="nav-link dropdown-toggle"
                id="dropdownMenu1"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Speed: {speedState}
              </a>
              <div className="dropdown-menu" aria-labelledby="dropdownMenu1">
                <button
                  className="dropdown-item btn-light"
                  type="button"
                  onClick={() => changeSpeed("Slow")}
                >
                  Slow
                </button>
                <button
                  className="dropdown-item btn-light"
                  type="button"
                  onClick={() => changeSpeed("Medium")}
                >
                  Medium
                </button>
                <button
                  className="dropdown-item btn-light"
                  type="button"
                  onClick={() => changeSpeed("Fast")}
                >
                  Fast
                </button>
              </div>
            </div>{" "}
          </li>
        </ul>
        <button
          type="button"
          className="btn btn-outline-success mr-2"
          onClick={() => visualizeAlgorithm()}
        >
          {algorithm}
        </button>
        <button
          type="button"
          className="btn btn-outline-success mr-2"
          onClick={() => generateMaze()}
        >
          {maze}
        </button>
        <button
          type="button"
          className="btn btn-outline-warning mr-2"
          onClick={() => clearGrid()}
        >
          Clear Gird
        </button>
      </div>
    </nav>
  );
};
export default NavBar;
