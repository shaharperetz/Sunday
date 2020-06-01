import React, { Component } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { connect } from "react-redux";
import LocalBoardService from "../services/LocalBoardService";
import { saveBoard } from "../actions/BoardActions";
import { moment } from "moment";

class Timeline extends Component {
  onChange = (date) => {
    let currBoard = this.props.currBoard;
    const column = this.props.column;
    const newStateDay = date[0].getDate();
    const newEndDate = date[1].getDate();
    const newMonth = date[0].getMonth();
    const newDate = {
      newStateDay,
      newEndDate,
      newMonth,
    };
    const newBoard = LocalBoardService.changeDueDateColumn(
      currBoard,
      column,
      newDate
    );
    saveBoard(newBoard);
  };
  onchange2 = (dates) => {
    let currBoard = this.props.currBoard;
    const column = this.props.column;
    let moments = [];
    dates.forEach((date) => {
      moments.push(moment(date).format("DD/MMM"));
    });
    const newTimeLine = {
      from: moments[0],
      to: moments[1],
    };

    const newBoard = LocalBoardService.changeDueDateColumn2(
      currBoard,
      column,
      newTimeLine,
      dates
    );
    saveBoard(newBoard);
  };

  render() {
    // const taskDueDate=new Date(this.props.column.value)

    var x = new Date(1590831130);
    return (
      <div>
        <Calendar
          onChange={this.onChange}
          value={x}
          howWeekNumbers
          selectRange
          hover
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
