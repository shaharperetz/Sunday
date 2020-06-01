import React from "react";
import { connect } from "react-redux";
import "../../style/cmps/progressBar.css";

class ProgressBar extends React.Component {


  showStatus = () => {
    const { group } = this.props;
    const doneMissions = group.tasks.filter((task) => task.status === "Done");

    if (doneMissions.length > 0) {
      var precent = parseInt((doneMissions.length / group.tasks.length) * 100);
    } else precent = 0;
    return precent;
  };
  render() {
    const pStyle = {
      width: `${this.showStatus()}%`,
    };
    return (
      <section className="progress-bar">
        <div className="full-width grey-status"></div>
        <div style={pStyle} className="color-status progress-bar-anim">
          <div>{this.showStatus()}%</div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    boards: state.userBoards,
  };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProgressBar);
