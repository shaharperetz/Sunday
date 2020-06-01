import React, { Component } from "react";
import "../../style/cmps/taskList.css";
import TaskPreview from "./TaskPreview.jsx";
import resize from "../../style/img/resize.svg";
import pencil from "../../style/img/pencil.svg";
import { TaskBoxList } from "./TaskBoxList.jsx";
import AddTask from "./AddTask";
import LocalBoardService from "../../services/LocalBoardService";
import { connect } from "react-redux";
import ProgressBar from "../Statistics/ProgressBar";
import GenereicProgBar from "../Statistics/GenereicProgBar";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskDetails from "./TaskDetails";

import {
  saveBoard,
  loadBoards,
  removeBoard,
  setCurrBoard,
} from "../../actions/BoardActions";
import SumBar from "../Statistics/SumBar";
import { CirclePicker } from "react-color";
import { set } from "date-fns";
// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  // padding: grid * 2,
  // margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  // background: isDragging ? "" : "",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  // background: isDraggingOver ? "" : "",
  // padding: grid,
  // width: 250,
});

class TaskList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.group.tasks,
      taskIsShown: true,
      groupName: this.props.name,
      groupNameIsEdit: false,
      groupColor: false,
      sortBy: null,
      taskInfoBox: false,

      // index,
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.group) !== JSON.stringify(this.props.group)) {
      this.setState({ items: this.props.group.tasks });
    }
  }

  toggleList = () => {
    if (this.state.taskIsShown) {
      this.setState({ taskIsShown: false });
    } else {
      this.setState({ taskIsShown: true });
    }
  };

  deleteTask = (task) => {
    let group = this.props.group;
    let board = this.props.board;
    let newBoard = LocalBoardService.removeTask(board, group, task);
    this.props.saveBoard(newBoard);
    this.props.loadBoards();
  };
  handleChange = (ev) => {
    ev.preventDefault();
    const value = ev.target.value;
    this.setState({ groupName: value });
  };

  updateGroupName = (ev) => {
    ev.preventDefault();
    let { board, group, loadBoards, saveBoard } = this.props;
    LocalBoardService.changeGroupName(board, group, this.state.groupName);
    saveBoard(board);
    loadBoards();
    this.toggleEdit();
  };

  toggleEdit = (ev) => {
    // ev.stopPropagation();
    this.setState(({ groupNameIsEdit }) => ({
      groupNameIsEdit: !groupNameIsEdit,
    }));
  };

  updateBoardColOrder = async (board) => {
    await this.props.saveBoard(board);
    await this.props.setCurrBoard(board);
    await this.props.loadBoards();
  };

  groupToggleColor = (ev) => {
    ev.preventDefault();

    ev.stopPropagation();
    this.setState(({ groupColor }) => ({
      groupColor: !groupColor,
    }));
  };

  setGroupColor = async (color, ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    this.setState({ groupColor: false });
    let group = this.props.group;
    let board = this.props.board;
    let newBoard = LocalBoardService.changeGroupColor(board, group, color.hex);
    await this.props.setCurrBoard(newBoard);
    this.props.saveBoard(newBoard);
    this.props.loadBoards();
  };

  //// DND FUNCTIONS

  onDragEnd = async (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items,
    });
    // debugger;
    console.log("onDragEnd -> items", items);

    // this.props.group.tasks = items;
    // const { items } = this.state;
    const { group, board } = this.props;
    const newBoard = LocalBoardService.changeTaskOrder(board, group, items);
    await this.props.saveBoard(newBoard);
    await this.props.setCurrBoard(newBoard);
    this.props.loadBoards();
  };
  // refreshItems = () => {
  //   this.setState({ items: this.props.groupEl });
  // };

  // moveMe = async (board, group, task, index) => {
  //   // const items = reorder(this.state.items, index, 0);

  //   let itemsStr = JSON.stringify(this.state.items);
  //   let items = JSON.parse(itemsStr);

  //   // let sortedItems = reorder(items, index, false);

  //   // const items = reorder(
  //   //   this.state.items,
  //   //   result.source.index,
  //   //   result.destination.index
  //   // );

  //   // items.splice(index, 1);
  //   // this.setState({
  //   //   index,
  //   // });
  //   this.props.moveMe(board, group, task);

  //   // const { group, board } = this.props;
  //   const newBoard = LocalBoardService.changeTaskOrder(board, group, items);
  //   // await this.props.saveBoard(newBoard);
  //   await this.props.setCurrBoard(newBoard);
  //   // this.props.loadBoards();
  // };
  hideInfoBox = () => {
    this.setState({ taskInfoBox: null });
  };

  openTaskInfoBox = (task) => {
    console.log("task", task);
    this.setState({ taskInfoBox: task }, () => {
      console.log("this.state", this.state.taskInfoBox);
    });
  };

  render() {
    const { taskInfoBox } = this.state;
    const { groupColor } = this.state;
    return (
      <div
        className={`   flex col ${
          this.state.taskIsShown ? "group-list" : "group-list-small flex"
        }`}
      >
        {taskInfoBox && (
          <TaskDetails
            task={taskInfoBox}
            hideInfoBox={this.hideInfoBox}
          ></TaskDetails>
        )}
        <div
          className={`task-list-container flex col space-evenly    flex col ${
            this.state.taskIsShown ? "" : "task-list-container-small"
          }`}
        >
          {this.props.group.tasks && !this.props.group.tasks.length > 0 ? (
            <h3>No Tasks Found!</h3>
          ) : (
            <div
              className={`task-list-card   flex col ${
                this.state.taskIsShown ? "" : "task-list-card-small"
              }`}
            >
              <div className="task-box-toplist-container flex a-center space-between">
                <div className="task-list-top flex a-center">
                  <img
                    className="resize-png"
                    onClick={this.toggleList}
                    src={resize}
                    alt="Resize"
                    title="Toggle Group"
                  />
                  {!this.state.groupNameIsEdit ? (
                    <>
                      <div
                        className="toggle-group-color"
                        title="Change group color"
                        style={{ backgroundColor: `${this.props.group.color}` }}
                        onClick={(ev) => this.groupToggleColor(ev)}
                      >
                        {groupColor && (
                          <div className="circle-group-container">
                            <CirclePicker
                              onChangeComplete={(color, ev) =>
                                this.setGroupColor(color, ev)
                              }
                            />
                          </div>
                        )}
                      </div>
                      <h2
                        onClick={(ev) => this.toggleEdit(ev)}
                        style={{ color: `${this.props.group.color}` }}
                      >
                        {this.props.name}
                        <img
                          className="pencil-svg"
                          onClick={(ev) => this.toggleEdit(ev)}
                          src={pencil}
                          alt="Edit"
                          title="Edit"
                        />
                      </h2>

                      {groupColor && (
                        <div
                          className="group-color-screen"
                          onClick={(ev) => this.groupToggleColor(ev)}
                        ></div>
                      )}
                    </>
                  ) : (
                    <>
                      <form>
                        <input
                          type="text"
                          name="groupName"
                          value={this.state.groupName}
                          onChange={(ev) => this.handleChange(ev)}
                          onBlur={(ev) => this.updateGroupName(ev)}
                        />
                      </form>
                    </>
                  )}
                </div>
                <div
                  className={`task-box-list-container  flex col ${
                    this.state.taskIsShown ? "" : "hide"
                  }`}
                >
                  <TaskBoxList
                    updateBoardColOrder={this.updateBoardColOrder}
                    items={this.props.cols}
                    board={this.props.board}
                  ></TaskBoxList>
                </div>
                {this.state.taskIsShown ? (
                  ""
                ) : (
                  <div className="closed-group-items-txt">
                    {this.props.group.tasks.length} Items
                  </div>
                )}
              </div>
              <div
                className={`task-list  flex col ${
                  this.state.taskIsShown ? "" : "hide"
                }`}
              >
                {/* // HERE Is the Task List */}
                {/* 
                ///// START OF DND */}

                <>
                  <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable">
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}
                        >
                          {this.state.items.map((task, index) => (
                            <Draggable
                              key={task._id}
                              draggableId={task._id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}
                                >
                                  <div>
                                    <TaskPreview
                                      setInfoTask={this.openTaskInfoBox}
                                      deleteTask={this.deleteTask}
                                      task={task}
                                      key={index}
                                      board={this.props.board}
                                      toggleTaskEdit={this.toggleTaskEdit}
                                      updateTaskName={this.updateTaskName}
                                      handleChangeTask={this.handleChangeTask}
                                      taskNameIsEdit={this.state.taskNameIsEdit}
                                      group={this.props.group}
                                    />
                                    {/* {item.content} */}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </>
                {/* 
///////////// END OF DND

/// OLD TASK LIST */}
                {/* 
                {this.props.tasks.map((task, idx) => (
                  <TaskPreview
                    deleteTask={this.deleteTask}
                    task={task}
                    key={idx}
                    board={this.props.board}
                    toggleTaskEdit={this.toggleTaskEdit}
                    updateTaskName={this.updateTaskName}
                    handleChangeTask={this.handleChangeTask}
                    taskNameIsEdit={this.state.taskNameIsEdit}
                    group={this.props.group}
                  />
                ))} */}

                {/* /// Until Here           */}
                <AddTask group={this.props.group}></AddTask>
                <div className="task-bar-for-progress">
                  <div className="div40">
                    <GenereicProgBar group={this.props.group} />
                    <SumBar group={this.props.group} />
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* <ProgressBar group={this.props.group}></ProgressBar> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
