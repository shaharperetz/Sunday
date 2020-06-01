import React from "react";
import GroupList from "../Groups/GroupList.jsx";
export default function BoardList(props) {
  return (
    <div className="board-list-container">
      <div className="board-list flex wrap j-center color-change-2x">
        {props.boards && !props.boards.length > 0 ? (
          <div className="group-list-container scrollbar" id="style-5">
            <h3>No Groups Found!</h3>
          </div>
        ) : (
          props.boards.map((board, idx) => (
            <GroupList
              onDeleteToy={props.onDeleteToy}
              onSelectToy={props.onSelectToy}
              key={board._id * Math.random()}
              board={board}
            />
          ))
        )}
      </div>
    </div>
  );
}
