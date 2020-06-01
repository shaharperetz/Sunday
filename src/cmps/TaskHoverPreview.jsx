import React from "react";
import UserService from "../../src/services/UserService";
import { render } from "@testing-library/react";
import { connect } from "react-redux";
import "../style/cmps/taskPreviewHover.css";
import InfoBoxes from "../cmps/InfoBoxes";

class TaskHoverPreview extends React.Component {
  state = {};

  render() {
    return (
      <>
        <div className="hover-preview-container">
          <InfoBoxes task={this.props.task} />
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    boards: state.userBoards,
    user: state.user.loggedInUser,
    onlineUsers: state.user.onlineUsers,
  };
};
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(TaskHoverPreview);
