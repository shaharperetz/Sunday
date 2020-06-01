import { connect } from "react-redux";
import React, { Component } from "react";
import {
  saveBoard,
  loadBoards,
  setCurrBoard,
} from "../../actions/BoardActions";
import { loadUsers } from "../../actions/UserActions";
import LocalBoardService from "../../services/LocalBoardService";
import add from "../../../src/style/img/add.png";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import randomColor from "random-color";

import FormDialog from "../Board/FormDialog";

class AddBoard extends Component {
  componentDidMount() {
    this.props.loadUsers();
  }

  state = {
    board: {
      // BOARD OBJECT
      name: "New Board",
      createdAt: Date.now(),
      //CLOUMNS OBJECT
      columns: [
        {
          type: "date",
          value: "Date",
          order: "1",
        },
        {
          type: "people",
          value: "Members",
          order: "2",
        },
        {
          type: "label",
          value: "",
          order: "3",
          color: "#C4C4C4",
        },
        {
          type: "text",
          value: "",
          order: "4",
        },
        {
          type: "number",
          value: "",
          order: "5",
        },
        {
          type: "priority",
          value: "",
          order: "6",
          color: "#C4C4C4",
        },
      ],
      //Label Object
      labels: [
        {
          color: "",
          value: "",
          order: "",
        },
      ],
      // Aggregation
      admins: [
        {
          userName: "user1412",
          // fullName
          _id: "1",
        },
      ], // Min users
      users: [
        {
          _id: "1",
          userName: "user1412",
          fullName: " full name1412",
          password: "password", // NO PASSWORD
          isAdmin: true,
          imgUrl: "www.img.com",
          lastSeen: "today", // timestamp
          loggedAmount: 2,
          location: "tel aviv",
          notifications: [], //notification object
          boards: [], // Boards ids
        },
        {
          userName: "user112",
          fullName: " full name1123",
          password: "password",
          _id: "1",
          isAdmin: "true",
          imgUrl: "www.img.com",
          lastSeen: "today",
          loggedAmount: 2,
          location: "tel aviv",
          notifications: [], //notification object
          boards: [], // Boards ids
        },
        {
          userName: "user2",
          fullName: " full name2",
          password: "password",
          _id: "1",
          isAdmin: "true",
          imgUrl: "www.img.com",
          lastSeen: "today",
          loggedAmount: 2,
          location: "tel aviv",
          notifications: [], //notification object
          boards: [], // Boards ids
        },
      ], // Min users
      groups: [
        {
          _id: uuidv4(),
          name: "New Project",
          createdAt: Date.now(),
          // ABIR COLS DONT TOUCH

          tasks: [
            {
              _id: uuidv4(),
              isDone: true,
              assignedGroupId: 124,
              taskTitle: "Task - Write you task here",
              createdAt: Date.now(),
              // Aggregation
              users: [], // Min users
              // ABIR COLS DONT TOUCH
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
                  aboutUser: 9000,
                },
              ], // updates objects
              notes: [], // Notes objects
              people: [],
              status: "new",
              priority: "urgent",
              DueDate: "",
              budget: "150",
              text: "text about task",
              link: "",
              files: [],
              history: [],
            },
            {
              _id: uuidv4(),
              isDone: true,
              assignedGroupId: 124,
              taskTitle: "Task - Write you task here",
              createdAt: Date.now(),
              // Aggregation
              users: [], // Min users
              // ABIR COLS DONT TOUCH
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
              notes: [], // Notes objects
              people: [],
              status: "new",
              priority: "urgent",
              DueDate: "1592925789",
              budget: "150",
              text: "text about task",
              link: "",
              files: [],
              history: [],
            },
            {
              _id: uuidv4(),
              isDone: true,
              assignedGroupId: 124,
              taskTitle: "Task - Write you task here",
              createdAt: Date.now(),
              // Aggregation
              users: [], // Min users
              // ABIR COLS DONT TOUCH
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
              notes: [], // Notes objects
              people: [],
              status: "new",
              priority: "urgent",
              DueDate: "1595517789",
              budget: "150",
              text: "text about task",
              link: "",
              files: [],
              history: [],
            },
            {
              _id: uuidv4(),
              isDone: true,
              assignedGroupId: 124,
              taskTitle: "Task - Write you task here",
              createdAt: Date.now(),
              // Aggregation
              users: [], // Min users
              // ABIR COLS DONT TOUCH
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
              notes: [], // Notes objects
              people: [],
              status: "new",
              priority: "urgent",
              DueDate: "1606148589",
              budget: "150",
              text: "text about task",
              link: "",
              files: [],
              history: [],
            },
          ], // Task object
          color: randomColor(0.99, 0.99).hexString(),
          lastUpdatedAt: "",
        },
      ],
      //group over

      // _Group Objects
      // Hard coded
      color: "red",
      //history objects,
      history: [],
    },
  };

  componentDidMount() {
    var color = randomColor(0.99, 0.99).hexString();
    console.log("color", color);
  }

  addBoard = async (value) => {
    let addBoard = this.state.board;
    addBoard.name = value;
    try {
      await this.props.saveBoard(addBoard);
      this.props.setCurrBoard(addBoard);
      await this.props.loadBoards();
    } catch (error) {
      console.log("couldnt add board");
    }
    // let newBoard = LocalBoardService.saveBoard(AddBoard);
  };

  render() {
    return (
      <>
        <FormDialog addBoard={this.addBoard} />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    boards: state.userBoards.board,
    users: state.users,
  };
};
const mapDispatchToProps = {
  saveBoard,
  loadBoards,
  loadUsers,
  setCurrBoard,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddBoard);
