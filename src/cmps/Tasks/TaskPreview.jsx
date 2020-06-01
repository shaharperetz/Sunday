import React, { Component } from "react";
import "../../style/cmps/taskPreview.css";
import TaskBox from "../../cmps/Tasks/TaskBox";
import deletePng from "../../style/img/delete.svg";
import LocalBoardService from "../../services/LocalBoardService";
import pencil from "../../style/img/pencil.svg";
import { connect } from "react-redux";
import {
  saveBoard,
  loadBoards,
  removeBoard,
  setCurrBoard,
} from "../../actions/BoardActions";
import InfoBoxes from "../InfoBoxes";
import TaskDetails from "./TaskDetails";
import { useEventCallback } from "@material-ui/core";
import note from "../../style/img/note.svg";
import TaskHoverPreview from "../TaskHoverPreview";
import eye from "../../style/img/eye.svg";

class TaskPreview extends Component {
  state = {
    taskTitle: this.props.task.taskTitle,
    taskNameIsEdit: false,
    isInfoBoxShown: false,
    hoverShown: false,
  };
  componentDidMount() {
    // let SortedCols = matchTaskBoxToBoardColumns(props);
    // let sortedCols = this.matchTaskBoxToBoardColumns(this.props);
    // window.addEventListener('click', () => {
    //   this.setState({ isInfoBoxShown: false})
    // });
  }

  hideInfoBox = () => {
    this.setState({ isInfoBoxShown: false });
  };

  SortCols(board, cols) {
    let order = [];
    board.columns.forEach((col) => {
      order.push(col.order);
    });
    let sortedCols = LocalBoardService.sortColumnsByBox(cols, order);
    return sortedCols;
  }

  // First Function
  matchTaskBoxToBoardColumns = () => {
    let { board, task } = this.props;
    let boardBox = [];
    board.columns.forEach((box) => {
      boardBox.push(box);
    });
    if (board.columns.length > task.columns.length) {
      boardBox.forEach((box) => {
        let isFound = false;
        for (var i = 0; i < task.columns.length; i++) {
          if (task.columns[i].order === box.order) isFound = true;
        }
        if (!isFound) {
          let boxCopy = JSON.stringify(box);
          task.columns.push(JSON.parse(boxCopy));
        }
      });
    }

    let cols = this.props.task.columns;
    let sortedCols = this.SortCols(board, cols);
    sortedCols.reverse();
    return sortedCols;
  };

  handleChange = (ev) => {
    ev.preventDefault();
    const { target } = ev;
    const value = target.value;
    this.setState({ taskTitle: value });
  };
  updateTaskName = async (ev, task) => {
    ev.preventDefault();
    let { boards, board, group, loadBoards, saveBoard } = this.props;
    if (!this.state.taskTitle) {
      this.toggleTaskEdit();
      return;
    }
    LocalBoardService.updateTaskName(board, task, this.state.taskTitle);
    this.changeHistoryTaskNames(boards, task);
    if (!this.state.taskTitle) {
      this.toggleTaskEdit();
      return;
    }
    LocalBoardService.updateTaskName(board, task, this.state.taskTitle);
    this.changeHistoryTaskNames(boards, task);

    await saveBoard(board);
    loadBoards();
    this.toggleTaskEdit();
  };
  changeHistoryTaskNames = (boards, task) => {
    boards.forEach((board) => {
      board.history.forEach((history) => {
        if (history.taskId === task._id) history.title = this.state.taskTitle;
      });
    });
  };
  toggleTaskEdit = (ev) => {
    // ev.stopPropagation();
    // ev.preventDefault();
    this.setState(({ taskNameIsEdit }) => ({
      taskNameIsEdit: !taskNameIsEdit,
    }));
  };

  toggleHover = (ev) => {
    // ev.stopPropagation();
    // ev.preventDefault();
    this.setState(({ hoverShown }) => ({
      hoverShown: !hoverShown,
    }));
  };

  toggleInfoBox = (ev) => {
    ev.preventDefault();
    const { task } = this.props;
    this.props.setInfoTask(task);
  };

  precDef = (ev) => {
    ev.preventDefault();
  };

  render() {
    const isInfoBoxShown = this.state.isInfoBoxShown;
    const { task } = this.props;
    return (
      <div className="task-bar flex j-start space-between">
        {/* {isInfoBoxShown && (
          <InfoBoxes task={task} hideInfoBox={this.hideInfoBox}></InfoBoxes>
        )} */}
        <div className="task-bar-title-container flex space-between a-center">
          <div className="title-box flex  a-center">
            <img
              className="delete-icon"
              src={deletePng}
              alt="Delete"
              title="Delete Task"
              onClick={() => this.props.deleteTask(task)}
            />
            <div
              className="little-box"
              style={{ backgroundColor: `${this.props.group.color}` }}
            ></div>
            {!this.state.taskNameIsEdit ? (
              <>
                <h2 onClick={(ev, props) => this.toggleTaskEdit(ev)}>
                  {task.taskTitle}
                </h2>
                <img
                  className="pencil-svg"
                  onClick={(ev, props) => this.toggleTaskEdit(ev)}
                  src={pencil}
                  alt="Edit"
                  title="Edit"
                />
              </>
            ) : (
              <form onSubmit={(ev) => this.precDef(ev)}>
                <input
                  type="text"
                  name="taskName"
                  className="input-edit-taskName"
                  value={this.state.taskTitle}
                  onChange={(ev) => this.handleChange(ev)}
                  onBlur={(ev) => this.updateTaskName(ev, task)}
                  placeholder="Enter a name.."
                  onSubmit={(ev) => this.updateTaskName(ev)}
                  required
                />
              </form>
            )}
          </div>

          <img
            src={note}
            alt=""
            className="note-task"
            onClick={() => this.props.setInfoTask(task)}
          />
        </div>
        <div className=" flex a-center j-center">
          <div
            onMouseEnter={this.toggleHover}
            onMouseLeave={this.toggleHover}
            className="hover-to-open"
          >
            <img
              src={eye}
              alt=""
              className="preview-note-task"
              onClick={() => this.props.setInfoTask(task)}
            />
            {this.state.hoverShown && (
              <TaskHoverPreview task={this.props.task}></TaskHoverPreview>
            )}
          </div>
        </div>
        <div className="task-bar-columns-container-new  space-evenly a-center">
          {this.matchTaskBoxToBoardColumns().map((col, idx) => {
            return <TaskBox key={idx} col={col} task={this.props.task} />;
          })}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  //State of the store to props of the cmp
  return {
    boards: state.userBoards.board,
    board: state.userBoards.currBoard,
  };
};
const mapDispatchToProps = {
  saveBoard,
  removeBoard,
  loadBoards,
  setCurrBoard,
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskPreview);

// export function TaskPreview(props) {
//   let task = props.task;
//   function SortCols(board, cols) {
//     let order = [];
//     board.columns.forEach((col) => {
//       order.push(col.order);
//     });
//     console.log("SortCols -> order", order);
//     let sortedCols = LocalBoardService.sortColumnsByBox(cols, order);
//     return sortedCols;
//   }
//   // First Function
//   let SortedCols = matchTaskBoxToBoardColumns(props);
//   function matchTaskBoxToBoardColumns(props) {
//     let board = props.board;
//     let boardBox = [];
//     board.columns.forEach((box) => {
//       boardBox.push(box);
//     });
//     if (board.columns.length > task.columns.length) {
//       boardBox.forEach((box) => {
//         let isFound = false;
//         for (var i = 0; i < task.columns.length; i++) {
//           if (task.columns[i].order === box.order) isFound = true;
//         }
//         if (!isFound) {
//           console.log("adding", box, "with order ", box.order);
//           task.columns.push(box);
//         }
//       });
//     }
//     let cols = task.columns;
//     let sortedCols = SortCols(board, cols);
//     sortedCols.reverse();
//     return sortedCols;
//   }
