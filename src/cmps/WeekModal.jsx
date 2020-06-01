import React from "react";

import SmallImg from "../cmps/SmallImg";
import { connect } from "react-redux";
import { saveBoard, loadBoards } from "../actions/BoardActions";
import LocalBoardService from "../services/LocalBoardService";
import Select from "react-select";
import makeAnimated from "react-select/animated";
// import LabelContainer from "./Columns/LabelContainer";
import AddPerson from "./Columns/AddPerson";
import moment from "moment";
const animatedComponents = makeAnimated();

class WeekModal extends React.Component {
  componentDidMount() {
  }

  changeStatus = () => {
  };

  containerClicked = (ev) => {
    ev.stopPropagation();
  };
  onChangeDueDate = () => {};
  onChangeTaskGroup = async (group) => {
    const { task } = this.props;
    const board = this.props.userBoards.find((b) => {
      return b.groups.some((g) => {
        return g._id === group._id;
      });
    });
    const currBoard = this.props.currBoard;
    const boardAfterRemoving = LocalBoardService.removeTaskFromGroup(
      board,
      group,
      task
    );
    const boardAfterAdding = LocalBoardService.addTaskToGroup(
      board,
      group,
      task
    );
    await this.saveAndLoad(boardAfterAdding);
  };
  onAddMemebers = () => {};
  findTaskGroups = () => {
    const { task } = this.props;
    const boards = this.props.userBoards;
    const taskGroups = [];
    boards.forEach((board) => {
      board.groups.forEach((group) => {
        if (group.tasks.some((t) => t._id === task._id))
          taskGroups.push(...board.groups);
      });
    });
    taskGroups.forEach((group) => {
      group.value = group.name;
      group.label = group.name;
    });
    return taskGroups;
  };
  saveAndLoad = async (board) => {
    await this.props.saveBoard(board);
    await this.props.loadBoards();
  };
  findCurrTaskGroup = () => {
    const { task } = this.props;
    let group = null;
    const boards = this.props.userBoards;
    boards.forEach((board) => {
      board.groups.forEach((g) => {
        g.tasks.forEach((t) => {
          if (t._id === task._id) group = g;
        });
      });
    });
    group.value = group.name;
    group.label = group.name;
    return group;
  };

  getPriorityColumn = () => {
    let { task } = this.props;
    const col = task.columns.find((col) => col.order === "6");
    return col;
  };

  getStatusColumn = () => {
    let { task } = this.props;
    const col = task.columns.find((col) => col.order === "6");
    return col;
  };
  getPeopleColumn() {
    const { task } = this.props;
    const peopleCol = task.columns.find((col) => col.type === "people");
    return peopleCol;
  }

  render() {
    const groupOptions = this.findTaskGroups();
    const x = this.findCurrTaskGroup();
    const peopleColumn = this.getPeopleColumn();
    const { task } = this.props;
    // const  priorityColumn = this.getPriorityColumn()
    const statusColumn = this.getStatusColumn();
    return (
      <div className="week-modal">
        <div onClick={() => this.props.closeModal()} className="modal-screen">
          <section className="week-modal-opts">
            <div
              onClick={(ev) => this.containerClicked(ev)}
              className="opts-container"
            >
              <div className="flex col j-center a-center">
                <h2>{task.text}</h2>
              </div>

              <div className="opts-bar flex">
                {/* <div className="opts-title">Group</div>
                <div className="opts-info">Invalid right now</div> */}
                Groups:
                <Select
                  options={groupOptions}
                  components={animatedComponents}
                  defaultValue={x}
                  onChange={(e) => this.onChangeTaskGroup(e)}
                />
              </div>

              <div className="opts-bar">
                <div className="opts-title">Members</div>
                <div className="opts-info">
                  {/* {task.users.map((user, idx) => (
                    <SmallImg
                      zindex={idx}
                      url={user.imgUrl}
                      name={user.username}
                      key={idx}
                    />
                  ))} */}
                  {this.props.currBoard && (
                    <AddPerson task={task} column={peopleColumn}></AddPerson>
                  )}
                </div>
              </div>

              {task.priority && (
                <div className="opts-bar">
                  <div className="opts-title">Priority</div>
                  <div
                    className="opts-info"
                    onClick={() => this.changePriority()}
                  >
                    {task.priority}
                  </div>
                </div>
              )}

              {task.status && (
                <div className="opts-bar">
                  <div className="opts-title">Status</div>

                  <div
                    className="opts-info"
                    onClick={() => this.changeStatus()}
                  >
                    {task.status}
                  </div>
                </div>
              )}

              {task.createdAt && (
                <div className="opts-bar">
                  <div className="opts-title">Created:</div>
                  <div className="opts-info">
                    {moment(task.createdAt).fromNow()}
                  </div>
                </div>
              )}

              {/* <div className="opts-bar">
                <div className="opts-title">Project</div>
                <div className="opts-info">Invalid yet</div>
              </div>

              <div className="opts-bar">
                <div className="opts-title">Time Est</div>
                <div className="opts-info">Invalid yet</div>
              </div> */}
            </div>
          </section>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userBoards: state.userBoards.board,
  currUser: state.user,
  currBoard: state.userBoards.currBoard,
});

const mapDispatchToProps = {
  saveBoard,
  loadBoards,
};

export default connect(mapStateToProps, mapDispatchToProps)(WeekModal);
