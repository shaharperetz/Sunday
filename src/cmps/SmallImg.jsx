import React from "react";
import UserService from "../../src/services/UserService";
import { render } from "@testing-library/react";
import { connect } from "react-redux";

class SmallImg extends React.Component {
  // CHANGE TO SWITCH CASE!!

  isOnline = () => {
    if (!this.props.isPopup) return;
    let isOnline = UserService.isOnline(
      this.props.user,
      this.props.onlineUsers
    );
    if (isOnline) return <div className="online" title="online"></div>;
    return <div className="offline" title="offline"></div>;
  };
  getImg = () => {
    if (this.props.type === "myweek" && this.props.url) {
      return (
        <img
          style={{ zIndex: `${this.props.zindex}` }}
          className="user-preview-circle-myweek"
          src={this.props.url}
          alt={this.props.name}
        />
      );
    }
    if (this.props.type === "myweek" && !this.props.url) {
      return (
        <div
          style={{ zIndex: `${this.props.zindex}` }}
          title={this.props.name}
          className="user-preview-circle-myweek"
        >
          {this.props.name && this.props.name.charAt(0)}
        </div>
      );
    }
    if (this.props.url) {
      return (
        <img
          style={{ zIndex: `${this.props.zindex}` }}
          className="user-preview-circle-chat heartbeat "
          src={this.props.url}
          alt={this.props.name}
        />
      );
    }
    if (this.props.user) {
      let renderedName = this.props.user.username
        ? this.props.user.username
        : this.props.user.name;
      return (
        <div
          style={{ zIndex: `${this.props.zindex}` }}
          title={renderedName}
          className={`user-preview-circle heartbeat ${this.props.type}`}
        >
          {renderedName && renderedName.charAt(0)}
        </div>
      );
    }

    return (
      <div
        style={{ zIndex: `${this.props.zindex}` }}
        title={this.props.name}
        className="user-preview-circle"
      >
        {this.props.name && this.props.name.charAt(0)}
      </div>
    );
  };

  render() {
    return (
      <>
        {this.getImg()}
        {this.isOnline()}
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
export default connect(mapStateToProps, mapDispatchToProps)(SmallImg);
