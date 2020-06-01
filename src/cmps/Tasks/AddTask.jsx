import { connect } from "react-redux";
import React, { Component } from "react";
import { saveBoard, loadBoards } from "../../actions/BoardActions";
import LocalBoardService from "../../services/LocalBoardService";
import { v4 as uuidv4 } from "uuid";

class AddTask extends Component {
  state = {
    task: {
      _id: uuidv4(),
      assignedGroupId: null,
      taskTitle: "Todo",
      createdAt: Date.now(),
      groupName: "",
      users: [], // Min users
      columns: [], //  Columns Objects
      updates: [
        {
          user: {
            userName: "user1412",
            _id: "1",
          },
          lastUpdate: Date.now(),
          description: "I changed all",
          imgUrl: "",
          aboutUser: 1234,
        },
      ], // updates objects
      notes: [
        {
          name: "name",
          description: "value",
          user: {
            userName: "user1412",
            _id: "1",
          },
          lastUpdate: Date.now(),
        },
      ], // Notes objects
      people: [],
    },
    taskTitle: "",
  };

  addTask = async (ev) => {
    ev.preventDefault();
    if (!this.state.taskTitle) return;
    let task = this.state.task;
    task.taskTitle = this.state.taskTitle;
    let board = await this.props.currBoard;
    let group = this.props.group;
    let newBoard = LocalBoardService.addTask(board, group, task);
    this.props.saveBoard(newBoard);
    this.props.loadBoards();
    this.setState({ taskTitle: "" });
  };
  handleChange = ({ target }) => {
    const value = target.value;
    this.setState({ taskTitle: value });
  };

  render() {
    return (
      <>
        <form className="add-task-bar flex" onSubmit={this.addTask}>
          <input
            type="text"
            name="title"
            placeholder="+ Add Task"
            value={this.state.taskTitle}
            onChange={(ev) => this.handleChange(ev)}
            onBlur={this.addTask}
            required
          />
        </form>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    boards: state.userBoards.board,
    currBoard: state.userBoards.currBoard,
  };
};
const mapDispatchToProps = {
  saveBoard,
  loadBoards,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddTask);
