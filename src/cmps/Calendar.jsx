import React, { Component } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { moment } from "moment";

import { connect } from "react-redux";
import LocalBoardService from "../services/LocalBoardService";
import { saveBoard } from "../actions/BoardActions";

class DatePicker extends Component {
  onChange = async (date) => {
    let currBoard = this.props.currBoard;
    let currTask = this.props.currTask;
    const column = this.props.column;
    const dateToSet = date.getMonth() + " " + date.getDate();
    const momentToSet = moment(date).format("MM-DD");
    const newBoard = LocalBoardService.changeTaskDateColumn(
      currBoard,
      column,
      momentToSet,
      currTask,
      date
    );
    saveBoard(newBoard);
  };
  render() {
    // const taskDueDate=new Date(this.props.column.value)
    var x = new Date(1590831130);
    return (
      <div>
        <Calendar onChange={this.onChange} value={x} howWeekNumbers hover />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currBoard: state.userBoards.currBoard,
});

const mapDispatchToProps = {
  saveBoard,
};
export default connect(mapStateToProps, mapDispatchToProps)(DatePicker);
