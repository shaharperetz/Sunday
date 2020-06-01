import { connect } from "react-redux";
import React, { Component } from "react";
import { saveBoard, loadBoards } from "../../actions/BoardActions";
import LocalBoardService from "../../services/LocalBoardService";
import { v4 as uuidv4 } from "uuid";
import randomColor from "random-color";

class AddGroup extends Component {
  state = {
    isLoading: true,
    group: {
      id: uuidv4(),
      name: "New Project",
      createdAt: "date",
      // ABIR COLS DONT TOUCH
      columns: [
        {
          type: "date",
          value: "Date",
          order: "1",
        },
        {
          type: "poeple",
          value: "poeple",
          order: "2",
        },
        {
          type: "label",
          value: "Labels",
          order: "3",
          color: "#C4C4C4",
        },
        {
          type: "text",
          value: "Text",
          order: "4",
        },
        {
          type: "number",
          value: "number",
          order: "5",
        },
      ],

      tasks: [
        {
          _id: uuidv4(),
          assignedGroupId: null,
          taskTitle: "Task - Write you task here",
          createdAt: "date",
          users: [], // Min users
          columns: [
            // {
            //   type: "label",
            //   value: "Done",
            //   order: "1",
            // },
            // {
            //   type: "text",
            //   value: "im text",
            //   order: "2",
            // },
            // {
            //   type: "number",
            //   value: 100,
            //   order: "3",
            // },
          ], //  Columns Objects
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
        {
          _id: uuidv4(),
          assignedGroupId: null,
          taskTitle: "Task - Write you task here",
          createdAt: "date",
          users: [], // Min users
          columns: [
            // {
            //   type: "label",
            //   value: "Done",
            //   order: "1",
            // },
            // {
            //   type: "text",
            //   value: "im text",
            //   order: "2",
            // },
            // {
            //   type: "number",
            //   value: 100,
            //   order: "3",
            // },
          ], //  Columns Objects
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
        {
          _id: uuidv4(),
          assignedGroupId: null,
          taskTitle: "Task - Write you task here",
          createdAt: "date",
          users: [], // Min users
          columns: [
            // {
            //   type: "label",
            //   value: "Done",
            //   order: "1",
            // },
            // {
            //   type: "text",
            //   value: "im text",
            //   order: "2",
            // },
            // {
            //   type: "number",
            //   value: 100,
            //   order: "3",
            // },
          ], //  Columns Objects
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
        {
          _id: uuidv4(),
          assignedGroupId: null,
          taskTitle: "Task - Write you task here",
          createdAt: "date",
          users: [], // Min users
          columns: [
            // {
            //   type: "label",
            //   value: "Done",
            //   order: "1",
            // },
            // {
            //   type: "text",
            //   value: "im text",
            //   order: "2",
            // },
            // {
            //   type: "number",
            //   value: 100,
            //   order: "3",
            // },
          ], //  Columns Objects
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
      ], // Task object
      color: randomColor(0.99, 0.99).hexString(),
      lastUpdatedAt: "",
    },
  };

  componentDidMount() {}

  AddGroup = async () => {
    this.setState({
      group: {
        ...this.state.group,
        color: randomColor(0.99, 0.99).hexString(),
      },
    });
    let addGroup = this.state.group;
    // let boardId = this.props.board._id;
    let board = this.props.currBoard;
    let updateInfo = {
      group: this.state.group,
      user: this.props.user,
      nextValue: addGroup.name,
      updateType: "New Group",
    };
    let newBoard = LocalBoardService.addGroup(board, addGroup);
    newBoard = LocalBoardService.addBoardHistory(board, updateInfo);
    await this.props.saveBoard(newBoard);
    this.props.loadBoards();
  };

  render() {
    return (
      <>
        <div
          className="add-group-btn flex a-center j-center"
          title="Add a New Group"
          onClick={this.AddGroup}
        >
          New Group
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    boards: state.userBoards.board,
    currBoard: state.userBoards.currBoard,
    user: state.user.loggedInUser,
  };
};
const mapDispatchToProps = {
  saveBoard,
  loadBoards,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddGroup);
