import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import "./ControlPanel.css";

class ControlPanel extends Component {
  state = {
    selectedAlgorithm: "Breadth First Search"
  };

  selectAlgorithm = algoName => {
    this.setState({
      selectedAlgorithm: algoName
    });
  };

  handleStartButtonClick = () => {
    const newState = { ...this.state };
    newState.enabled = !newState.enabled;
    this.setState(newState);
    this.props.toggleSearch();
  };

  render() {
    return (
      <Navbar
        className="justify-content-between"
        bg="dark"
        variant="dark"
        fixed="top"
      >
        <Container>
          <Navbar.Brand href="#home">Path Finding Visualizer</Navbar.Brand>

          <Nav variant="tabs" defaultActiveKey="/home" className="">
            <Nav.Item>
              <Nav.Link onClick={this.props.clickHandlers.startHandler}>
                (S)tart
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={this.props.clickHandlers.endHandler}>
                (E)nd
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={this.props.clickHandlers.wallHandler}>
                (W)all
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Nav>
            <NavDropdown
              title={this.state.selectedAlgorithm}
              id="collasible-nav-dropdown"
            >
              {this.props.sortingAlgos.map((algo, i) => {
                return (
                  <NavDropdown.Item
                    key={i}
                    onClick={evt => {
                      this.selectAlgorithm(algo.name);
                    }}
                  >
                    {algo.name}
                  </NavDropdown.Item>
                );
              })}
            </NavDropdown>
            <Button
              onClick={evt => this.handleStartButtonClick()}
              variant="outline-info"
            >
              Search
            </Button>
          </Nav>
        </Container>
      </Navbar>
    );
  }
}

export default ControlPanel;
