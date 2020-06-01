import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import "../../style/cmps/boardNav.css";
import resize from "../../style/img/resize.svg";
import AddBoard from "./AddBoard.jsx";
import { setChatType } from "../../actions/UserActions";

import {
  loadBoards,
  setCurrBoard,
  removeBoard,
} from "../../actions/BoardActions";
export class BoardNav extends Component {
  state = {
    boardIsShown: true,
  };

  toggleList = () => {
    if (this.state.boardIsShown) {
      this.setState({ boardIsShown: false });
    } else {
      this.setState({ boardIsShown: true });
    }
  };

  setBoardChat = async (myId, toUserId) => {
    let chatWith = {
      id: { myId, toUserId },
      type: "board",
    };
    await this.props.setChatType(chatWith);
  };

  render() {
    const { boards } = this.props;
    return (
      <>
        {boards && (
          <div
            className={` ${
              this.state.boardIsShown
                ? "board-nav-container"
                : "board-nav-container-hidden"
            } flex col`}
          >
            <img
              className="resize-png-boardnav"
              onClick={this.toggleList}
              src={resize}
              alt="here"
            />
            <div className="board-nav-title flex  a-center space-between">
              <h3>Your Boards</h3>
              {this.state.boardIsShown && <AddBoard></AddBoard>}
            </div>
            <div className="board-list flex col">
              {this.props.boards && !this.props.boards.length ? (
                <div className="board-nav-container">
                  <h3>No Boards :('</h3>
                </div>
              ) : (
                this.props.boards.map((board, idx) => (
                  <div
                    onClick={() => this.setBoardChat(board._id, board._id)}
                    key={idx}
                    className="board-list-btn"
                  >
                    <NavLink to={`/board/${board._id}`}>{board.name}</NavLink>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  //State of the store to props of the cmp
  return {
    boards: state.userBoards.board,
  };
};
const mapDispatchToProps = {
  loadBoards,
  setCurrBoard,
  removeBoard,
  setChatType,
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardNav);
