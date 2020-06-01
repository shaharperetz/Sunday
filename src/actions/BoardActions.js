import BoardServices from '../services/BoardService'
import { loading, doneLoading } from './SystemActions';
import SocketService from '../services/SocketService'


export function loadBoards() {
  return async dispatch => {
    try {
      // example for loading
      dispatch(loading());
      const boards = await BoardServices.getBoards();
      dispatch(setBoards(boards));
    } catch (err) {
      console.log('BoardActions: err in loadBoards', err);
    } finally {
      dispatch(doneLoading());
    }
  };
}

export function setFilter(text) {
  return async dispatch => {
    try {
      dispatch({ type: 'SET_FILTER', text });
    } catch (err) {
      console.log('BoardActions: err in setfilter', err);
    }
  }
}



export function saveBoard(board) {


  return async dispatch => {
    try {
      const type = board._id ? 'UPDATE_BOARD' : 'ADD_BOARD'
      const savedBoard = await BoardServices.saveBoard(board)
      SocketService.emit('doRefresh', 'js')
      dispatch({ type, savedBoard })
    } catch (err) {
      console.log('boardActions: err in add or update board', err);
    }
  }
}




export function removeBoard(boardId) {
  return async dispatch => {
    try {
      await BoardServices.remove(boardId);
      dispatch(_removeBoard(boardId));
    } catch (err) {
      console.log('BoardActions: err in removeBoard', err);
    }
  };
}

export function setCurrBoard(board) {
  console.log("setCurrBoard -> board", board)
  return dispatch => {
    dispatch({ type: 'SET_CURRBOARD', board });
  }
}

function setBoards(board) {
  return {
    type: 'SET_BOARDS',
    board
  };
}


function _removeBoard(boardId) {
  return {
    type: 'BOARD_REMOVE',
    boardId
  };
}


// function _addGroup(board) {
//   return {
//     type: 'ADD_GROUP',
//     board
//   }
// }

// function _removeGroup(board) {
//   return {
//     type: 'REMOVE_BOARD',
//     board
//   }
// }

// function _addTask(board) {
//   return {
//     type: 'ADD_TASK',
//     board
//   }
// }
// function _removeTask(board) {
//   return {
//     type: 'REMOVE_TASK',
//     board
//   }
// }
// function _updateTask(board) {
//   return {
//     type: 'UPDATE_TASK',
//     board
//   }
// }
// function _updateBoard={

// }