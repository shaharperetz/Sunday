import ChatService from '../services/ChatService';
import SocketService from '../services/SocketService'

export function loadRooms() {
  return async dispatch => {
    try {
      const rooms = await ChatService.query();
      let roomsAfterCheck = rooms ? rooms : [];
      console.log("ROOMS FROM SERVER", roomsAfterCheck)
      dispatch(setRooms(roomsAfterCheck));

    } catch (err) {
      console.log('ChatActions: err in loatchats', err);
    }
  };
}

export function addRoom(room) {
  console.log("addRoom -> room", room)
  return async dispatch => {
    try {
      const addedRoom = await ChatService.saveChat(room);
      console.log("addRoom -> addedRoom", addedRoom)
      dispatch(_addRoom(addedRoom));
    } catch (err) {
      console.log('ChatActions: err in addRooms', err);
    }
  };
}

export function saveRoom(room, allRooms) {
  // debugger
  return async dispatch => {

    try {
      const type = room._id ? 'UPDATE_ROOM' : 'ADD_ROOM'
      room.lastUpdate = Date.now()
      const savedRoom = await ChatService.saveChat(room, allRooms)
      // SocketService.emit('doRefresh', 'js')
      dispatch({ type, savedRoom })
    } catch (err) {
      console.log('ChatActions: err in add or update board', err);
    }
  }
}

export function setCurrChatRoom(room) {
  console.log("setCurrChatRoom -> room", room)
  return async dispatch => {
    dispatch({ type: 'SET_CURR_CHAT_ROOM', room })
  }
}


function setRooms(rooms) {
  return {
    type: 'SET_ROOMS',
    rooms
  };
}

function _addRoom(room) {
  return {
    type: 'ADD_ROOM',
    room
  };
}
