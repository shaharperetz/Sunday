import React from "react";
import moment from "moment";

export default function ChartDetails({ board }) {
  const getTasksNums = () => {
    let counter = 0;
    board.groups.forEach((gr) => {
      gr.tasks.forEach((task) => counter++);
    });
    return counter;
  };
  return (
    <>
      <div className="chart-details-conatiner">
        <h2>
          {board.name} Board <br /> Created at{" "}
          {moment(board.createdAt).format("ll")}
        </h2>

        <p>{getTasksNums()} Tasks</p>
      </div>
    </>
  );
}
