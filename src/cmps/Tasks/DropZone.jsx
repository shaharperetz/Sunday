import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { saveBoard, loadBoards } from "../../actions/BoardActions";
import file from "../../style/img/sideimg.png";
class DropZone extends Component {
  state = {
    selectedFile: null,
  };
  onChangeHandler = (event) => {
    this.props.savefileToTask(event, this.state.selectedFile);
  };

  onFormSubmit(e) {
    e.preventDefault(); // Stop form submit
  }

  render() {
    return (
      <form className="download-wrapper" onSubmit={this.onFormSubmit}>
        <img src={file}></img>
        <label htmlFor="file" style={{ cursor: "pointer" }}>
          Add Photos
        </label>
        <input
          type="file"
          name="file"
          id="file"
          onChange={this.onChangeHandler}
          hidden
        />
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  currBoard: state.userBoards.currBoard,
});

const mapDispatchToProps = {
  loadBoards,
  saveBoard,
};

export default connect(mapStateToProps, mapDispatchToProps)(DropZone);
