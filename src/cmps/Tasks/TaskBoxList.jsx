import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskBox from "./TaskBox";
import LocalBoardService from "../../services/LocalBoardService";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  fontSize: "13px",

  // change background colour if dragging
  // background: isDragging ? "#b2bec3" : "white",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  // background: isDraggingOver ? "#74b9ff" : "white",
  display: "flex",
  overflow: "auto",
});

export class TaskBoxList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.board.columns,
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevState.items) !==
      JSON.stringify(this.props.board.columns)
    ) {
      this.setState({
        items: this.props.board.columns,
      });
    }
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items,
    });
    // let order = [];
    // items.forEach((item) => {
    //   order.push(item.order);
    // });

    let board = this.props.board;
    let newBoard = LocalBoardService.updateColumnOrder(board, items);
    this.props.updateBoardColOrder(newBoard);
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided, snapshot) => (
            <div
              className="task-box-list-cont-new a-center j-center"
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              {this.state.items.map((item, index) => (
                <Draggable
                  key={item.order}
                  draggableId={item.order}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      className="group-col-box"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      {<TaskBox isTaskBox={true} col={item}></TaskBox>}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}
