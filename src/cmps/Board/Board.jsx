import GroupList from "../Groups/GroupList.jsx";
import { connect } from "react-redux";
import React, { Component } from "react";
import LocalBoardService from "../../services/LocalBoardService";
import {
  saveBoard,
  removeBoard,
  setCurrBoard,
  loadBoards,
} from "../../actions/BoardActions";
import DoughnutChart from "../Statistics/DoughnutChart";
import RadarChart from "../Statistics/RadarChart";
import ChartDetails from "../Statistics/ChartDetails";
import NivoBar from "../Statistics/NivoBar.jsx";

class Board extends Component {
  sortColumnsByBox = async (order) => {
    let board = LocalBoardService.sortColumnsByBox(this.props.currBoard, order);
    this.props.saveBoard(board);
    this.props.setCurrBoard(board);
    await this.props.loadBoards();
  };

  get boardToDisplay() {
    const { filterByText, currBoard } = this.props;
    return LocalBoardService.filter(currBoard, filterByText);

    // return filteredBoard
  }
  RadarChart;
  getViewByType = (board) => {
    let viewType = this.props.viewType;
    let view;
    switch (viewType) {
      case "charts":
        view = (
          <div className="chart-container flex col">
            <ChartDetails board={this.props.currBoard} />
            <div className="nivo-bar">
              <NivoBar board={this.props.currBoard} />
            </div>
            <div className="chart-radar-pie">
              <div className="stats-radar-pie-container flex space-evenly">
                <RadarChart board={this.props.currBoard} />
                <DoughnutChart board={this.props.currBoard} />
              </div>
            </div>
          </div>
        );
        break;
      // case "pie":
      //   view = (
      //     <div className="chart-container">
      //       <ChartDetails board={this.props.currBoard} />
      //       <DoughnutChart board={this.props.currBoard} />
      //     </div>
      //   );
      //   break;
      default:
        view = (
          <GroupList
            // swapTaskFromGroup={this.swapTaskFromGroup}
            sortColumnsByBox={this.sortColumnsByBox}
            groups={board.groups}
            board={board}
          />
        );
    }
    return view;
  };

  addTaskToGroup = async (board, group, task) => {
    let newBoard = LocalBoardService.addTaskToGroup(board, group, task);
    await this.props.saveBoard(newBoard);
    this.props.setCurrBoard(newBoard);
    this.props.loadBoards();
  };

  render() {
    const board = this.boardToDisplay;
    return <>{this.getViewByType(board)}</>;
  }
}

const mapStateToProps = (state) => {
  //State of the store to props of the cmp
  return {
    boards: state.userBoards.board,
    currBoard: state.userBoards.currBoard,
    filterByText: state.userBoards.filterByText,
  };
};
const mapDispatchToProps = {
  saveBoard,
  removeBoard,
  setCurrBoard,
  loadBoards,
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);
