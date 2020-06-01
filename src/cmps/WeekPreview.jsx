import React from "react";
import SmallImg from "../cmps/SmallImg";
import WeekModal from "../cmps/WeekModal";
import { connect } from "react-redux";
export default class WeekPreview extends React.Component {
  state = {
    modal: false,
  };

  openModal = () => {
    this.setState({ modal: true });
  };
  closeModal = () => {
    this.setState({ modal: false });
  };
  findRelatedBoard = () => {};
  getColor = (columns) => {
    let correctTask = columns.find((col) => col.order === "3");
    return correctTask.color;
  };
  render() {
    const { modal } = this.state;
    const {
      text,
      tasktitle,
      status,
      priority,
      users,
      taskTitle,
      groupName,
      columns,
    } = this.props;
    return (
      <div className="week-preview">
        <div className="week-prev-text">
          <p className="week-prev-title">{taskTitle}</p>
          {groupName && (
            <p className="week-prev-desc"> from {groupName} group</p>
          )}
        </div>
        <div className="week-users">
          {users.map((user, idx) => (
            <SmallImg
              zindex={idx}
              url={user.imgUrl}
              name={user.username}
              key={idx}
              type={"myweek"}
            />
          ))}
        </div>
        <div
          style={{ backgroundColor: `${this.getColor(columns)}` }}
          onClick={() => this.openModal()}
          className={`week-status`}
        >
          {status}
        </div>
        {modal && <WeekModal closeModal={this.closeModal} task={this.props} />}
      </div>
    );
  }
}
