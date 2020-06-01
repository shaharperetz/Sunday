import React from "react";
import "../../style/cmps/boardHeader.css";
import AddGroup from "../Groups/AddGroup";
import FilterByText from "../Filters/FilterByText.jsx";
import Swal from "sweetalert2";
import ConfirmDialog from "../Board/ConfirmDialog";
import SelectCmp from "../SelectCmp";
import moment from "moment";
import dots from "../../style/img/dots.png";
import UserList from "../UserList";
import { connect } from "react-redux";
import { TextField } from "@material-ui/core";
import LocalBoardService from "../../services/LocalBoardService";

import {
  setCurrBoard,
  loadBoards,
  saveBoard,
} from "../../actions/BoardActions";

class BoardHeader extends React.Component {
  state = {
    boardNameEdit: false,
    boardDescEdit: false,
  };

  confirmDelete = () => {
    let boardId = this.props.board._id;
    this.props.removeBoard(boardId);
  };

  handleEditBoard = (ev) => {
    this.setState(({ boardNameEdit }) => ({ boardNameEdit: !boardNameEdit }));
  };

  handleEditDesc = (ev) => {
    this.setState(({ boardDescEdit }) => ({ boardDescEdit: !boardDescEdit }));
  };

  editBoardName = async (ev) => {
    const { currBoard } = this.props;
    const { value } = ev.target;
    if (!value) {
      this.handleEditBoard();
      return;
    }
    this.setState({ boardNameEdit: false });
    const newBoard = LocalBoardService.changeBoardName(currBoard, value);
    await this.props.saveBoard(newBoard);
    this.props.setCurrBoard(newBoard);
    this.props.loadBoards();
  };

  editBoardDesc = async (ev) => {
    const { currBoard } = this.props;
    const { value } = ev.target;
    if (!value) {
      this.handleEditDesc();
      return;
    }
    this.setState({ boardDescEdit: false });
    const newBoard = LocalBoardService.changeBoardDesc(currBoard, value);
    await this.props.saveBoard(newBoard);
    this.props.setCurrBoard(newBoard);
    this.props.loadBoards();
  };

  handleKeyPressed = (ev) => {
    if (ev.key !== "Enter") return;
    this.editBoardName(ev);
  };
  handleKeyPressedDesc = (ev) => {
    if (ev.key !== "Enter") return;
    this.editBoardDesc(ev);
  };

  render() {
    const { board } = this.props;
    const { boardNameEdit, boardDescEdit } = this.state;
    return (
      <div className="board-header-container flex  space-between">
        <div className="header-box flex col ">
          <div className="flex a-start col board-name-dec-container">
            {!boardNameEdit && (
              <h2 onClick={(ev) => this.handleEditBoard(ev)}>{board.name}</h2>
            )}

            {boardNameEdit && (
              <div className="board-name-container ">
                <TextField
                  autoFocus
                  onBlur={(ev) => this.editBoardName(ev)}
                  className="edit-board-input"
                  placeholder={`${board.name}`}
                  label="Enter new board name"
                  onKeyPress={(ev) => this.handleKeyPressed(ev)}
                ></TextField>
              </div>
            )}

            {!boardDescEdit && (
              <p onClick={(ev) => this.handleEditDesc(ev)}>
                {board.desc ? board.desc : "board description"}
              </p>
            )}
            {boardDescEdit && (
              <TextField
                autoFocus
                className="edit-board-desc-input"
                onBlur={(ev) => this.editBoardDesc(ev)}
                placeholder={board.desc ? board.desc : "board description"}
                label={"board description"}
                onKeyPress={(ev) => this.handleKeyPressedDesc(ev)}
              ></TextField>
            )}
          </div>
        </div>

        <div className="header-select">
          <div className="view-select-box">
            <SelectCmp
              handleChange={this.props.toggleChart}
              name={"viewType"}
              label={"Select Table"}
              options={["board", "charts"]}
            />
          </div>
        </div>

        <div className="flex col space-between">
          <div className="flex space-between">
            <div className="dots-board-header">
              <img
                onClick={this.props.toggleMoreOptions}
                title="More options"
                className="side-nav-img"
                src={dots}
                alt="More options"
              ></img>
            </div>
            {this.props.moreOptionsIsOpen && (
              <>
                <div
                  onClick={(ev) => this.props.toggleMoreOptions(ev)}
                  className="back-screen-container"
                >
                  {" "}
                </div>
                <div className="more-options-container flex col fade-in-editor">
                  <ConfirmDialog remove={this.confirmDelete} />

                  <div className="add-user-toboard">
                    {this.props.addUserToBoard && (
                      <UserList
                        toggleMoreOptions={this.props.toggleMoreOptions}
                        toggleAddUserToBoard={this.props.toggleAddUserToBoard}
                      ></UserList>
                    )}
                    <div onClick={this.props.toggleAddUserToBoard}>
                      Invite your team
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="filter-add-container flex a-end ">
            <AddGroup board={this.props.board}></AddGroup>

            <FilterByText currBoard={this.props.board} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  //State of the store to props of the cmp
  return {
    boards: state.userBoards.board,
    currBoard: state.userBoards.currBoard,
  };
};
const mapDispatchToProps = {
  setCurrBoard,
  loadBoards,
  saveBoard,
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardHeader);
