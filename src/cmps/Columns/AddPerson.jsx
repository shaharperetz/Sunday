import React, { Component } from "react";
import { connect } from "react-redux";
import LocalBoardService from "../../services/LocalBoardService";
import {
  saveBoard,
  loadBoards,
  setCurrBoard,
} from "../../actions/BoardActions";
import { loadUsers } from "../../actions/UserActions";
import UsersPreviewBox from "../UsersPreviewBox";
import deletePng from "../../style/img/delete.svg";
import { NavLink } from "react-router-dom";
import moment from "moment";
class AddPerson extends Component {
  state = {
    usersToAdd: null,
    isShown: false,
    persons:
      this.props.column.persons && this.props.column.persons.length > 0
        ? this.props.column.persons
        : [],
  };
  async componentDidMount() {
    const peopleToSet =
      this.props.column.persons && this.props.column.persons.length > 0
        ? this.props.column.persons
        : [];
    this.setState({ persons: peopleToSet });
    // await this.props.loadUsers();
    this.getAllPersons();
  }
  addPerson = async (person) => {
    this.setState({ isShown: false, persons: [...this.state.persons, person] });

    const column = this.props.column;
    const currBoard = this.props.currBoard;
    const task = this.props.task;
    let newBoard = LocalBoardService.addPersonToColumn(
      currBoard,
      column,
      task,
      person
    );
    let updateInfo = {
      column,
      user: this.props.currUser,
      updateType: "Member Add",
      task,
      assignedTo: person,
    };
    newBoard = LocalBoardService.addBoardHistory(currBoard, updateInfo);
    this.props.setCurrBoard(newBoard);
    await this.props.saveBoard(newBoard);
    this.props.loadBoards();
  };
  searchPeople = (e) => {
    e.preventDefault();
    const users = this.props.users;
    const usersToAdd = users.filter((user) => {
      return user.username.includes(e.target.value);
    });
    this.setState({ usersToAdd });
  };
  getAllPersons = () => {
    const users = this.props.users;
    const usersToAdd = users.filter((user) => {
      return user.username.includes("");
    });
    this.setState({ usersToAdd });
  };
  removePerson = (person) => {
    const { column, currBoard } = this.props;
    const newBoard = LocalBoardService.removePersonToTask(
      currBoard,
      person,
      column
    );
    this.props.saveBoard(newBoard);
    this.props.loadBoards();
  };
  togglePersonBox = () => {
    this.setState(({ isShown }) => ({
      isShown: !isShown,
    }));
  };
  render() {
    const users = this.state.persons;
    const isShown = this.state.isShown;
    const usersToAdd = this.state.usersToAdd;
    return (
      <React.Fragment>
        <UsersPreviewBox
          people={users}
          togglePersonBox={this.togglePersonBox}
        ></UsersPreviewBox>
        {isShown && (
          <div
            onClick={this.togglePersonBox}
            className="exit-btn-persons"
          ></div>
        )}
        {isShown && (
          <div className="person-component flex col">
            <input
              autoFocus
              placeholder="Search People"
              onChange={(e) => this.searchPeople(e)}
            />
            <section className="person-scroll-conatiner">
              <section className="people-in-task">
                {users &&
                  users.map((user, idx) => {
                    return (
                      <section key={idx} className="peron-preview-delet">
                        <div className="flex space-between">
                          <NavLink to={`/profile/${user._id}`}>
                            <button className="person-preview-btn">
                              {user.username}
                            </button>
                          </NavLink>
                          <img
                            className="delete-icon person-remove"
                            src={deletePng}
                            alt="Delete"
                            title="Delete Task"
                            onClick={() => this.removePerson(user)}
                          />
                        </div>
                      </section>
                    );
                  })}
                {/* {!users&&    <input onChange={(e)=>this.searchPeople(e)}></input>} */}
              </section>
            </section>
            <div id="style-5" className="found-people-container">
              <span>Invite your Team:</span>
              <section className="found-people">
                {usersToAdd &&
                  usersToAdd.map((user, idx) => {
                    return (
                      <article
                        key={idx}
                        className="min-user-card flex"
                        onClick={() => this.addPerson(user)}
                      >
                        <div
                          className="user-preview-circle-column"
                          title={`${user.username} Last seen at ${moment(
                            user.lastSeen
                          ).fromNow()}`}
                          key={idx}
                        >
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span>{user.username}</span>
                      </article>
                    );
                  })}
                <div className="invite-with-email"></div>
              </section>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => ({
  users: state.user.users,
  currBoard: state.userBoards.currBoard,
  currUser: state.user.loggedInUser,
  board: state.userBoards,
});
const mapDispatchToProps = {
  saveBoard,
  loadBoards,
  loadUsers,
  setCurrBoard,
};
export default connect(mapStateToProps, mapDispatchToProps)(AddPerson);
