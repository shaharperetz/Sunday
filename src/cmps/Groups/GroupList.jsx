import React from "react";
import "../../style/cmps/groupList.css";
import TaskList from "../Tasks/TaskList";
import TrelloView from "../TrelloViewTEST.jsx";
export default function GroupList(props) {
  return (
    <div className="group-list-container " id="style-5">
      {props.groups && !props.groups.length > 0 ? (
        <div className="group-list-container " id="style-5">
          <h3>No Groups Found!</h3>
        </div>
      ) : (
        // <TrelloView
        //   groups={props.groups}
        //   swapTaskFromGroup={props.swapTaskFromGroup}
        //   // addTaskToGroup={props.addTaskToGroup}
        // ></TrelloView>

        //// REGULAR
        props.groups.map((group, idx) => {
          return (
            <div key={idx}>
              <TaskList
                group={group}
                key={idx}
                name={group.name}
                tasks={group.tasks}
                cols={group.columns}
                sortColumnsByBox={props.sortColumnsByBox}
              />
            </div>
          );
        })
      )}
    </div>
  );
}
