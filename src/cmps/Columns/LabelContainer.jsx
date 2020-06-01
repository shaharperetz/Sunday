import React, { Component } from "react";
import LabelPreviewUnEdit from "./LabelPreviewUnEdit";
import LabelPreviewEdit from "./LabelPreviewEdit";

import { connect } from "react-redux";
import LocalBoardService from "../../services/LocalBoardService";

import {
  saveBoard,
  loadBoards,
  setCurrBoard,
} from "../../actions/BoardActions";

class LabelContainer extends Component {
  state = {
    isEditAble: false,
    labels: null,
    allLabels: null,
    className: "",
  };

  componentDidMount() {
    var HardCoded;
    if (this.props.type === "label") {
      this.setState({ className: "label-status" });
      HardCoded = [
        {
          _id: "111a",
          color: "#00C875",
          value: "Done",
          status: "Done",
        },
        {
          _id: "222v",
          color: "#FDAB3D",
          value: "Working",
          status: "Working",
        },
        {
          _id: "333b",
          color: "#E2445C",
          value: "Stuck",
          status: "Stuck",
        },
        {
          _id: "333asb",
          color: "#66CCFF",
          value: "Review",
          status: "Waiting for review",
        },
        {
          _id: "333aasassb",
          color: "#C4C4C4",
          value: "",
          status: "new",
        },
      ];
    } else if (this.props.type === "priority") {
      this.setState({ className: "label-priority" });
      HardCoded = [
        {
          _id: "111safa",
          color: "#eb3006c2",
          value: "High",
        },
        {
          _id: "22afs2v",
          color: "#5e27cdbb",
          value: "Medium",
        },
        {
          _id: "3fsa33b",
          color: "#00aaffb2",
          value: "low",
        },
        {
          _id: "333aasassb",
          color: "#C4C4C4",
          value: "",
          status: "new",
        },
      ];
    }

    this.setState({ labels: HardCoded }, () => {
      this.loadAllLabels();
    });
  }

  loadAllLabels = () => {
    const labels = this.state.labels;
    var filterLabels = [...new Set(labels)];
    if (this.props.labels) filterLabels.push(...this.props.labels);
    this.setState({ allLabels: filterLabels });
  };

  // UNEDIT
  setLabel = async (label, color, text) => {
    const { currBoard } = this.props;
    const board = LocalBoardService.changeLabelColumn(
      currBoard,
      label,
      color,
      text
    );
    await this.props.saveBoard(board);
    this.props.setCurrBoard(board);
    this.props.loadBoards();
    // await this.props.toggleContainer();

    //find the label with the order and set the label on the props who props column who submit the label
  };

  removeLabel = async (label) => {
    const { currBoard, column } = this.props;
    const board = LocalBoardService.removeLabel(currBoard, column, label);
    await this.props.saveBoard(board);
    // await this.props.toggleContainer();
    this.props.loadBoards();
    this.props.setCurrBoard(board);
  };

  setColumn = async (color, text) => {
    const task = this.props.task;
    const { currBoard, column, currUser } = this.props;
    const { className } = this.state;
    let updateInfo = {
      column,
      user: currUser,
      nextValue: text,
      updateType: "Label Change",
      task,
      color,
    };

    let board = LocalBoardService.addBoardHistory(currBoard, updateInfo);
    board = LocalBoardService.addTaskHistory(currBoard, updateInfo);
    board = LocalBoardService.setColumn(
      currBoard,
      column,
      color,
      text,
      task,
      className
    );

    // board = LocalBoardService.setColumn(board, column, color, text, task);
    // board = LocalBoardService.addBoardHistory(board, updateInfo);
    this.props.toggleContainer();
    this.props.setCurrBoard(board);
    await this.props.saveBoard(board);
    this.props.loadBoards();
  };

  onRemove = (onRemove, orderId) => {};

  toggleEdit = (ev) => {
    ev.stopPropagation();
    this.setState(({ isEditAble }) => ({ isEditAble: !isEditAble }));
  };

  saveChanges = (ev) => {
    ev.stopPropagation();
    this.loadAllLabels();
    this.setState(({ isEditAble }) => ({ isEditAble: !isEditAble }));
  };

  addLabel = async (ev) => {
    ev.stopPropagation();
    let label = {
      color: "lightgray",
      value: "New Label",
      status: "New Label",
    };
    const column = this.props.column;
    const currBoard = this.props.currBoard;
    const board = LocalBoardService.addLabel(currBoard, column, label);
    this.props.saveBoard(board);
    // this.props.toggleContainer();
    this.props.loadBoards();
    this.props.setCurrBoard(board);
  };

  render() {
    const { isEditAble, allLabels } = this.state;
    let labelsFromProps =
      this.props.labels && this.props.labels.length > 0
        ? this.props.labels
        : [];
    return (
      <section
        className={`label-container col fade-in-editor flex a-center j-center ${this.state.className}`}
      >
        {isEditAble &&
          labelsFromProps &&
          labelsFromProps.map((label, idx) => {
            return (
              <LabelPreviewEdit
                key={idx}
                label={label}
                onRemove={this.onRemove}
                setLabel={this.setLabel}
                removeLabel={this.removeLabel}
              />
            );
          })}

        {isEditAble && (
          <>
            <div className="add-label-btn" onClick={(ev) => this.addLabel(ev)}>
              Add Label
            </div>
            <div
              className="label-submit"
              onClick={(ev) => this.saveChanges(ev)}
            >
              Save
            </div>
          </>
        )}

        {!isEditAble &&
          allLabels &&
          allLabels.map((label, idx) => {
            return (
              <LabelPreviewUnEdit
                setColumn={this.setColumn}
                key={idx}
                isEdit={false}
                label={label}
              />
            );
          })}

        {!isEditAble && (
          <div className="label-submit" onClick={(ev) => this.toggleEdit(ev)}>
            Add / Edit Labels
          </div>
        )}
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  //State of the store to props of the cmp
  return {
    currBoard: state.userBoards.currBoard,
    currUser: state.user.loggedInUser,
  };
};
const mapDispatchToProps = {
  saveBoard,
  loadBoards,
  setCurrBoard,
};

export default connect(mapStateToProps, mapDispatchToProps)(LabelContainer);

///value={label.value} color={label.color} id={label._id} order={label.order}
