import React from "react";
import { connect } from "react-redux";
import "../../style/cmps/progressBar.css";

class GenericProgBar extends React.Component {
  state = {
    done: null,
    working: null,
    review: null,
    stuck: null,
    other: null,
  };

  componentDidMount() {
    this.showStatus();
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevProps.boards) !== JSON.stringify(this.props.boards))
      this.showStatus();
  }

  showStatus = () => {
    const { group } = this.props;
    const doneMissions = group.tasks.filter((task) => task.status === "Done");
    const workingMissions = group.tasks.filter(
      (task) => task.status === "Working"
    );
    const stuckMissions = group.tasks.filter((task) => task.status === "Stuck");
    const reviewMissions = group.tasks.filter(
      (task) => task.status === "Review"
    );

    //// make them number of length
    const stuckMissionsL = stuckMissions.length;
    const workingMissionsL = workingMissions.length;
    const doneMissionsL = doneMissions.length;
    const reviewMissionsL = reviewMissions.length;
    const otherMissionsL =
      group.tasks.length -
      (doneMissionsL + workingMissionsL + stuckMissionsL + reviewMissionsL);

    const total = group.tasks.length;
    //////// make them %  and color + length////

    const stuckMissionsP = {
      percent: (stuckMissionsL / total) * 100,
      color: "#eb2f06",
      num: stuckMissionsL,
    };
    const workingMissionsP = {
      percent: (workingMissionsL / total) * 100,
      color: "rgb(253, 171, 61)",
      num: workingMissionsL,
    };
    const donegMissionsP = {
      percent: (doneMissionsL / total) * 100,
      color: "#44bd32",
      num: doneMissionsL,
    };
    const reviewgMissionsP = {
      percent: (reviewMissionsL / total) * 100,
      color: "#00A8FF",
      num: reviewMissionsL,
    };
    const otherMissionsP = {
      percent: (otherMissionsL / total) * 100,
      color: "#F4F6F7",
      num: otherMissionsL,
    };

    this.setState({
      done: donegMissionsP,
      working: workingMissionsP,
      stuck: stuckMissionsP,
      review: reviewgMissionsP,
      other: otherMissionsP,
    });

    // const totalP = {percent : 100 , color : 'rgb(64, 144, 140)'}

    //////////////////////////////////////
  };

  getColStart = () => {
    const { currBoard } = this.props.boards;
    let idx = currBoard.columns.findIndex((col) => col.order === "3");
    return idx + 1;
  };

  render() {
    const { stuck, review, working, other, done } = this.state;
    if (!stuck) return <h2>Loading...</h2>;

    const doneStyle = {
      backgroundColor: done.color,
      width: `${done.percent}%`,
    };
    const workingStyle = {
      backgroundColor: working.color,
      width: `${working.percent}%`,
    };
    const reviewStyle = {
      backgroundColor: review.color,
      width: `${review.percent}%`,
    };
    const stuckStyle = {
      backgroundColor: stuck.color,
      width: `${stuck.percent}%`,
    };
    const otherStyle = {
      backgroundColor: other.color,
      width: `${other.percent}%`,
    };
    return (
      /// make this as much width as you want with any color that you want
      <section
        className="s-progress-container"
        style={{ gridColumnStart: `${this.getColStart()}` }}
      >
        <div
          style={doneStyle}
          title={`Done: ${done.num} ${done.percent}%`}
          className="s-prog-child"
        ></div>
        <div
          style={workingStyle}
          title={`Working on it: ${working.num} ${working.percent}%`}
          className="s-prog-child"
        ></div>
        <div
          style={reviewStyle}
          title={`Waiting for review: ${review.num} ${review.percent}%`}
          className="s-prog-child"
        ></div>
        <div
          style={stuckStyle}
          title={`Stuck: ${stuck.num} ${stuck.percent}%`}
          className="s-prog-child"
        ></div>
        <div
          style={otherStyle}
          title={`Others: ${other.num} ${other.percent}%`}
          className="s-prog-child"
        ></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(GenericProgBar);
