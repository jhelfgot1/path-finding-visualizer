import React, { Component } from "react";
import UserModes from "./UserModes";
import VisualizationCanvas from "../VisualizationCanvas/VisualizationCanvas";
import ControlPanel from "../ControlPanel/ControlPanel";

class AppContainer extends Component {
  state = {
    mode: UserModes.none,
    searching: false
  };

  startHandler = () => {
    this.setState({ mode: UserModes.placeStart });
  };
  endHandler = () => {
    this.setState({ mode: UserModes.placeEnd });
  };
  wallHandler = () => {
    this.setState({ mode: UserModes.placeWall });
  };

  toggleSearch = () => {
    console.log("Toggling Search");
    this.setState({
      mode: UserModes.none,
      searching: !this.state.searching
    });
  };

  render() {
    const sortingAlgoNames = ["Breadth First Search", "Depth First Search"];

    const sortingAlgos = sortingAlgoNames.map((name, i) => {
      return { name: name, key: i };
    });

    const clickHandlers = {
      startHandler: this.startHandler,
      endHandler: this.endHandler,
      wallHandler: this.wallHandler
    };
    return (
      <div>
        <ControlPanel
          clickHandlers={clickHandlers}
          sortingAlgos={sortingAlgos}
          toggleSearch={this.toggleSearch}
        ></ControlPanel>
        <VisualizationCanvas
          mode={this.state.mode}
          height="2000"
          width="3000"
          executingSearch={this.state.searching}
        />
      </div>
    );
  }
}

export default AppContainer;
