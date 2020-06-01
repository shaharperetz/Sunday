import HttpService from './HttpService';

export default {
  query,
  remove,
  getRoomById,
  saveChat,
  addMsg,
  getRoomKey,
  createNewRoom,
  getUser,
  filterChatsByUser
};

export async function query() {
  const res = await HttpService.get('chat');
  return res;
}

async function saveChat(room, allRooms) {
  console.log('room', room)

  let roomToApply;
  let ifTrue = true
  if (!room._id) roomToApply = await HttpService.post('chat', room)

  if (room.type === 'board' && allRooms && allRooms.length > 0) {
    allRooms.forEach(r => {
      if (r.chatRoomId === room.chatRoomId) ifTrue = false
    })


  }
  else if (true) roomToApply = await HttpService.put(`chat/${room._id}`, room)
  return roomToApply
}

function createNewRoom(chatWith, messageList, id, type) {
  let chatRoom = {
    chatRoomId: getRoomKey(chatWith), //Sort function
    roomHistory: messageList,
    userA: id.myId,
    userB: id.toUserId,
    type,
  };

  return chatRoom

}

function remove(boardId, rooms) {
  let fixedId = _getMongoIdByBoardId(boardId, rooms)
  return HttpService.delete(`chat/${fixedId}`);
}

function filterChatsByUser(chatRooms, myUser) {
  if (!chatRooms.length) return
  let filteredRooms = chatRooms.filter((room) => {
    if (room && !room.userA) return false
    if (room.userA === myUser._id || room.userB === myUser._id) return true;
  });

  let sortedRooms = sortByKey(filteredRooms, "lastUpdate");
  return sortedRooms;


}
function sortByKey(array, key) {
  return array.sort(function (a, b) {
    var x = a[key];
    var y = b[key];
    return x < y ? -1 : x > y ? 1 : 0;
  });
};




function getUser(chatWith, board, users) {
  // if (!chatWith) return;
  if (chatWith.type === "board") {
    let data = {};
    data.username = "Board Chat: " + board.name;
    return data;
  } else {
    let user = users.find((user) => user._id === chatWith.id.toUserId);
    return user;
  }
}




///////////////////////// local ///////////////////

/// filter after query

function getRoomById(chatWith, allRooms) {
  const roomKey = _getRoomById(chatWith)

  const room = allRooms && allRooms.length > 0 && allRooms.find(room => room.chatRoomId === roomKey)

  return room
}

function getRoomKey(obj) {
  let arr = [];
  arr.push(obj.id.myId)
  arr.push(obj.id.toUserId)
  let roomKey = arr.sort().join('')

  return roomKey
}


function _getRoomById(obj) {
  let arr = [];
  arr.push(obj.id.myId)
  arr.push(obj.id.toUserId)
  let roomKey = arr.sort().join('')

  return roomKey
}


function addMsg(room, newMsg) {
  if (!room.history) room.history = [];
  room.history.push(newMsg)
  return room
}

function _getMongoIdByBoardId(boardId, rooms) {
  var currRoom = rooms.find(room => room.chatRoomId === `${boardId}${boardId}`)
  return currRoom._id

}
