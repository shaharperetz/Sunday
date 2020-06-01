import React, { Component } from "react";
import Inbox from "../../pages/Inbox";
import Updates from "../Updates";
import InfoBoxes from "../InfoBoxes.jsx";
import ActivityLog from "../ActivityLog";
import { loadBoards, saveBoard } from "../../actions/BoardActions";
import { connect } from "react-redux";
import TaskInbox from "./TaskInbox";

class TaskDetails extends Component {
  state = {
    chosenRender: "info-boxes",
  };

  setChosenOpt = (val) => {
    this.setState({ chosenRender: val });
  };

  render() {
    const { chosenRender } = this.state;
    const { task } = this.props;

    return (
      <>
        <div
          onClick={() => this.props.hideInfoBox()}
          className="backscreen-info-box bgc-slow"
        ></div>
        <section className="clickbgc-info-box slide-in-right-info">
          <div
            className="info-box-exit-btn"
            onClick={() => this.props.hideInfoBox()}
          >
            X
          </div>
          {/* <h3>{task.text}</h3> */}
          <h3>{task.taskTitle}</h3>
          <div className="details-opts">
            <div
              className="opt-select"
              onClick={() => this.setChosenOpt("updates")}
            >
              Updates
            </div>
            <div
              className="opt-select"
              onClick={() => this.setChosenOpt("info-boxes")}
            >
              Info Boxes
            </div>
            {/* {task.users.map((user, idx) => <SmallImg zindex={idx} url={user.imgUrl} name={user.name} key={idx} />)} */}
          </div>

          <div className="detail-container">
            {chosenRender === "updates" && <TaskInbox task={task}></TaskInbox>}
            {chosenRender === "info-boxes" && (
              <InfoBoxes task={task} hideInfoBox={this.props.hideInfoBox} />
            )}
            {chosenRender === "activity-log" && <ActivityLog />}
          </div>
        </section>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  userBoards: state.userBoards,
  currUser: state.user.loggedInUser,
  currBoard: state.userBoards.currBoard,
});

const mapDispatchToProps = {
  loadBoards,
  saveBoard,
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskDetails);
