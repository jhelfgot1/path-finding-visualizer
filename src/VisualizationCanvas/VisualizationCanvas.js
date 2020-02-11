import React, { Component } from "react";
import UserModes from "../AppContainer/UserModes";
import "./VisualizationCanvas.css";
import GridContents from "./GridContents";

class Intersection {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  equals(otherIntersection) {
    return this.x === otherIntersection.x && this.y === otherIntersection.y;
  }
}

class VisualizationCanvas extends Component {
  state = {};

  constructor(props) {
    super(props);
    this.searchTimeout = 100;
    this.canvas = null;
    this.ctx = null;
    this.start = null;
    this.end = null;
    this.walls = [];
    this.visited = null;
    this.visitedMap = null;
    this.path = null;
    this.hoverCanvas = null;
    this.hoverCtx = null;

    this.canvasRef = React.createRef();
    this.hoverCanvasRef = React.createRef();

    this.grid = [];

    for (let i = 0; i < this.props.width / 20; i++) {
      this.grid.push([]);
      for (let j = 0; j < this.props.height / 20; j++) {
        this.grid[i].push(GridContents.empty);
      }
    }
  }

  componentDidMount() {
    if (!this.canvas) {
      this.canvas = this.canvasRef.current;
      this.ctx = this.canvas.getContext("2d");
      this.hoverCanvas = this.hoverCanvasRef.current;
      this.hoverCtx = this.hoverCanvas.getContext("2d");
      this.redrawCanvas();
    }
  }

  getAdjacentCoordinates = coordinate => {
    const adjacents = [];
    if (coordinate.x > 0) {
      adjacents.push(new Intersection(coordinate.x - 1, coordinate.y));
    }
    if (coordinate.x < this.props.width / 20 - 1) {
      adjacents.push(new Intersection(coordinate.x + 1, coordinate.y));
    }
    if (coordinate.y > 0) {
      adjacents.push(new Intersection(coordinate.x, coordinate.y - 1));
    }
    if (coordinate.y < this.props.height / 20 - 1) {
      adjacents.push(new Intersection(coordinate.x, coordinate.y + 1));
    }
    return adjacents;
  };

  iterateSearch = () => {
    const path = this.searchQueue[0];
    this.path = path;
    this.searchQueue.splice(0, 1);
    const coordinate = path[path.length - 1];
    const adjacentCoords = this.getAdjacentCoordinates(coordinate);
    for (let i = 0; i < adjacentCoords.length; i++) {
      const currentCoord = adjacentCoords[i];
      if (!this.visitedMap[currentCoord.x][currentCoord.y]) {
        this.visitedMap[currentCoord.x][currentCoord.y] = true;
        this.visited.push(currentCoord);
        const newPath = path.slice();
        newPath.push(currentCoord);
        if (currentCoord.equals(this.end)) {
          this.path = newPath;
          this.pathFound = true;
          return;
        }
        this.searchQueue.push(newPath);
      }
    }
  };

  breadthFirstSearch = () => {
    this.pathFound = false;
    this.visitedMap = [];
    this.visited = [];
    for (let i = 0; i < this.props.width / 20; i++) {
      this.visitedMap.push([]);
      for (let j = 0; j < this.props.height / 20; j++) {
        this.visitedMap[i].push(false);
      }
    }

    this.searchQueue = [];
    this.searchQueue.push([this.start]);
    this.visitedMap[this.start.x][this.start.y] = true;
    while (this.searchQueue.length > 0 && !this.pathFound) {
      this.iterateSearch();
    }
  };

  componentDidUpdate(prevProps) {
    this.hoverCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (prevProps.executingSearch !== this.props.executingSearch) {
      this.breadthFirstSearch();
    }
    this.redrawCanvas();
  }

  redrawCanvas = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let x = 0; x <= this.props.width; x = x + 20) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.props.height);
    }
    for (let y = 0; y <= this.props.height; y = y + 20) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.props.width, y);
    }

    if (this.visited) {
      this.visited.map(visitedCoord => {
        this.ctx.fillStyle = "gold";
        this.ctx.fillRect(visitedCoord.x * 20, visitedCoord.y * 20, 20, 20);
      });
    }

    if (this.path) {
      this.path.map(pathCoord => {
        this.ctx.fillStyle = "aqua";
        this.ctx.fillRect(pathCoord.x * 20, pathCoord.y * 20, 20, 20);
      });
    }

    if (this.start) {
      this.ctx.fillStyle = "green";
      this.ctx.fillRect(this.start.x * 20, this.start.y * 20, 20, 20);
    }

    if (this.end) {
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(this.end.x * 20, this.end.y * 20, 20, 20);
    }

    this.walls.map(wall => {});

    this.ctx.stroke();
  };

  handleCanvasClick = evt => {
    let clickedCoords = null;
    switch (this.props.mode) {
      case UserModes.placeStart:
        clickedCoords = this.screenToGridCoords(evt.clientX, evt.clientY);

        if (this.start) {
          this.grid[this.start.x][this.start.y] = GridContents.empty;
        }

        this.grid[clickedCoords.x][clickedCoords.y] = GridContents.start;
        this.start = clickedCoords;
        break;

      case UserModes.placeEnd:
        clickedCoords = this.screenToGridCoords(evt.clientX, evt.clientY);

        if (this.end) {
          this.grid[this.end.x][this.end.y] = GridContents.empty;
        }

        this.grid[clickedCoords.x][clickedCoords.y] = GridContents.end;
        this.end = clickedCoords;
        break;

      case UserModes.placeWall:
        break;
      default:
        break;
    }

    this.redrawCanvas();
  };

  screenToGridCoords = (clientX, clientY) => {
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.floor((clientX - rect.left) / 20);
    const y = Math.floor((clientY - rect.top) / 20);
    return new Intersection(x, y);
  };

  handleCanvasHover = evt => {
    const hoverBox = this.screenToGridCoords(evt.clientX, evt.clientY);
    let fillColor = "";
    switch (this.props.mode) {
      case UserModes.placeStart:
        fillColor = "green";
        break;
      case UserModes.placeEnd:
        fillColor = "red";
        break;
      case UserModes.placeWall:
        fillColor = "black";
        break;
      default:
        return;
    }
    this.hoverCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.hoverCtx.fillStyle = fillColor;
    this.hoverCtx.globalAlpha = 0.5;
    this.hoverCtx.fillRect(hoverBox.x * 20, hoverBox.y * 20, 20, 20);
  };

  render() {
    return (
      <div className="VisCanvasContainer">
        <canvas
          ref={this.canvasRef}
          width={this.props.width}
          height={this.props.height}
        ></canvas>
        <canvas
          onMouseMove={evt => {
            this.handleCanvasHover(evt);
          }}
          onClick={evt => {
            this.handleCanvasClick(evt);
          }}
          ref={this.hoverCanvasRef}
          width={this.props.width}
          height={this.props.height}
        ></canvas>
      </div>
    );
  }
}

export default VisualizationCanvas;
