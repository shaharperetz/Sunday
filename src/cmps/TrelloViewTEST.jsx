import React, { useState } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskList from "./Tasks/TaskList";
import LocalBoardService from "../services/LocalBoardService";

// fake data generator

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  //   debugger;
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
// const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  //   padding: grid * 2,
  //   margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  //   background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
});
const getListStyle = (isDraggingOver) => ({
  //   background: isDraggingOver ? "lightblue" : "lightgrey",
  //   padding: grid,
  //   width: 250,
});

//   LocalBoardService.addTaskToGroup(board, group, task);
// function druggingStarted(board, group, task) {
//   console.log("STARTED DRUGGING");
//   board, group, task;
//   //   LocalBoardService.removeTaskFromGroup();
// }

export default function TrelloView(props) {
  const [state, setState] = useState([props.groups]);

  function onDragEnd(result) {
    const { source, destination } = result;

    if (result.isCool) {
      //   const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState.push(result.smart);
      setState(newState);
    }

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(newState.filter((group) => group.length));
    }
  }
  // MY FUCNTIONS
  let boardState;
  let groupState;
  let taskState;
  let dragIsOn = false;
  function addHere(groupToRemoveFrom, groupToAdd, task) {
    if (JSON.stringify(groupToRemoveFrom) === JSON.stringify(groupToAdd)) {
      return;
    }
    console.log("DRAG DROP DETECTED");
    if (dragIsOn) {
      let taskStr = JSON.stringify(task);

      props.swapTaskFromGroup(
        boardState,
        groupToRemoveFrom,
        groupToAdd,
        taskStr
      );
    }
    dragIsOn = false;
  }
  function moveMe(board, group, task) {
    console.log("IM DRAGGED");
    dragIsOn = true;
    boardState = board;
    groupState = group;
    taskState = task;
  }

  let itemsEl = state.reverse();
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {itemsEl.map((el, ind) => (
        <Droppable key={ind} droppableId={`${ind}`}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              {el.map((groupEL, index) => (
                <Draggable
                  key={groupEL._id}
                  draggableId={groupEL._id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <div
                        onMouseUp={() =>
                          addHere(groupState, groupEL, taskState)
                        }
                      >
                        {/* <div key={index}> */}
                        <TaskList
                          //   druggingStarted={druggingStarted}
                          moveMe={moveMe}
                          groupEL={groupEL}
                          group={groupEL}
                          key={index}
                          onDragEndTest={onDragEnd}
                          name={groupEL.name}
                          tasks={groupEL.tasks}
                          cols={groupEL.columns}
                          sortColumnsByBox={props.sortColumnsByBox}
                        />
                        {/* </div> */}
                        {/* {item.content} */}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </DragDropContext>
  );
}

{
  /* <QuoteApp />; */
}
