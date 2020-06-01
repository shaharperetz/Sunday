import React, { Component } from "react";
import { connect } from "react-redux";
import { parse } from "date-fns/esm";

class SumBar extends Component {
  state = {
    sum: null,
    sign: "$",
  };

  componentDidMount() {
    this.loadNums();
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevProps.boards) !== JSON.stringify(this.props.boards))
      this.loadNums();
  }

  loadNums = () => {
    const { group } = this.props;
    let sum = 0;
    group.tasks.forEach((task) => {
      task.columns.forEach((col) => {
        if (col.type === "number") {
          let num = parseInt(col.value);
          if (Number.isInteger(num)) sum += num;
        }
      });
    });

    this.setState({ sum });
  };

  getColStart = () => {
    const { currBoard } = this.props.boards;
    let idx = currBoard.columns.findIndex((col) => col.order === "5");
    return idx + 1;
  };

  render() {
    const { sign, sum } = this.state;
    if (!sum)
      return (
        <section
          className="sum-container flex a-center col"
          style={{ gridColumnStart: `${this.getColStart()}` }}
        >
          <div className="num-sum">0</div>
          <p className="sum-text">sum</p>
        </section>
      );
    return (
      <section
        className="sum-container flex a-center col"
        style={{ gridColumnStart: `${this.getColStart()}` }}
      >
        <div className="num-sum">
          {/* {sign} */}
          {sum}
        </div>
        <p className="sum-text">sum</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(SumBar);
