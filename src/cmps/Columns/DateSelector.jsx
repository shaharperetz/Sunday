import React, { Component } from "react";
import { TextField } from "@material-ui/core";
import LocalBoardService from "../../services/LocalBoardService";
import { connect } from "react-redux";

import { saveBoard, loadBoards, setCurrBoard } from "../../actions/BoardActions";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class DateSelector extends Component {
  state = {
    startDate: new Date(),
  };

  async componentDidMount() {
    const startDate = await this.props.column.value;
    let fixedDate = new Date(startDate);
    if (startDate !== "Date") this.setState({ startDate: fixedDate });
  }

  handleChange = async (date) => {
    let fixedDate = date.getTime();
    const { currBoard, column } = this.props;
    const board = LocalBoardService.changeColumn(currBoard, column, fixedDate);

    await this.props.saveBoard(board);
    this.setState({ startDate: fixedDate });
    // await this.props.loadBoards();
    await this.props.setCurrBoard(board);
    await this.props.loadBoards();
  };
  render() {
    const { column } = this.props;
    const value = column.value === "Date" ? new Date() : column.value;
    return (
      <div>
        <form className={"classes.container "} noValidate>
          <DatePicker
            selected={this.state.startDate}
            onChange={(date) => this.handleChange(date)}
          />
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currBoard: state.userBoards.currBoard,
});

const mapDispatchToProps = {
  saveBoard,
  loadBoards,
  setCurrBoard,
};

export default connect(mapStateToProps, mapDispatchToProps)(DateSelector);
