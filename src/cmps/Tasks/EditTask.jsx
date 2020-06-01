import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Select from "react-select";
import Calendar from "react-calendar";
// import TaskTimeline from "./Timeline";
import SimpleReactCalendar from "simple-react-calendar";
import DatePicker from "../Calendar";
// import { moment } from 'moment';
import "react-calendar/dist/Calendar.css";

export class EditTask extends Component {
  // state = {
  //   _id: 2222,
  //   assignedGroupId: 123,
  //   taskTitle: "Todo",
  //   createdAt: "date",
  //   submitDate: "1590030531",
  //   // Aggregation
  //   users: [{ _id: 1234, name: "shahar" }], // Min users
  //   // Inside Tas
  //   columns: [], //  Columns Objects
  //   updates: [], // updates objects
  //   notes: [], // Notes objects
  //   people: [
  //     { userName: "Abir", _id: "1" },
  //     { userName: "shahar", _id: "2" },
  //   ],
  //   status: "Done",
  //   priority: "urgent",
  //   DueDate: "15.02",
  //   budget: "150",
  //   text: "text about task",
  //   link: "",
  //   assignedBy: 1234,
  //   assignedTo: 1234,
  //   associatedBoardId: 1,
  //   assingedByUser: {
  //     userName: "user1412",
  //     _id: "1",
  //   },
  //   assignedToUser: {
  //     userName: "user1412",
  //     _id: "2",
  //   },
  //   boards: this.props.userBoards.board,
  //   columns: [
  //     {
  //       type: "label",
  //       value: "Working On it",
  //       order: "1",
  //     },
  //     {
  //       type: "label",
  //       value: "Done",
  //       order: "2",
  //     },
  //     {
  //       type: "text",
  //       value: "im text",
  //       order: "3",
  //     },
  //     {
  //       type: "number",
  //       value: 100,
  //       order: "4",
  //     },
  //   ],
  //   timeline: [],
  // };
  
  getTaskBoardGroups = () => {
    const board = this.state.boards;
    const relaventBoard = board.find(
      (board) => +board._id === this.state.associatedBoardId
    );
    const taskGroups = relaventBoard.groups;
    return taskGroups;
  };

  getReporter = () => {
    const Reporter = this.state.assingedByUser;
    return Reporter;
  };
  geTaskStatus = () => {
    return this.state.columns.filter((col) => col.type === "label");
  };
  getBudget = () => {
    return this.state.columns.filter((col) => col.type === "number");
  };
  getPeople = () => {
    return this.state.people;
  };
  onChangeDueDate = (date) => {
    const res = {
      date: date.getDate(),
      day: date.getDay(),
      month: date.getMonth(),
    };
    const timeStr = res.month + res.day + "  " + res.date;
    this.setState({ DueDate: timeStr });
  };

  render() {
    const taskGroups = this.getTaskBoardGroups();
    const Reporter = this.getReporter();
    const labels = this.geTaskStatus();
    const people = this.getPeople();
    const budget = this.getBudget();
    return (
      <div className="edit-modal">
        <div className="group">
          <span>Groups</span>
          <select name="groups" id="groups">
            {taskGroups.map((group) => {
              return <option>{group.name}</option>;
            })}
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
          </select>
        </div>
        <div className="assinging-user">
          <span>Reporter</span>
          {Reporter.userName}
        </div>
        <div className="due-date flex">
          <span>Due Date:</span>
          <span>{this.state.DueDate}</span>
          <DatePicker onchangeDate={this.onDateChange}></DatePicker>
          {/* <SimpleReactCalendar activeMonth={new Date()} /> */}
        </div>
        <div className="task-lables">
          <span>Labels:</span>
          <select>
            {labels.map((label) => {
              return <option>{label.value}</option>;
            })}
          </select>
        </div>
        <div className="assigned-to">
          <span>Assigned:</span>
          {people.map((person) => {
            return <div className="person">{person.userName}</div>;
          })}
        </div>
        <div className="budget">
          <span>Budget:</span>
          <span>
            {budget.map((budget) => {
              return budget.value;
            })}
          </span>
        </div>
        <div className="timeline flex">
          TimeLine:
          {/* <TaskTimeline></TaskTimeline> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userBoards: state.userBoards,
  currUser: state.user,
  currBoard:state.userBoards.currBoard
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(EditTask);

