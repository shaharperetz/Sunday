const initialState = {
    chatRooms: [],
    currChatRoom: null
};

export default function (state = initialState, action = {}) {
    switch (action.type) {
        case 'ADD_ROOM':
            return {
                ...state,
                chatRooms: [...state.chatRooms, action.room]
            }
        case 'SET_ROOMS':
            return {
                ...state,
                chatRooms: action.rooms
            }
        case 'UPDATE_ROOM':
            return {
                ...state,
                chatRooms: state.chatRooms.map(room => room._id === action.room._id ? action.room : room)
            };
        case 'CHAT_REMOVE':
            return {
                ...state,
                chatRooms: [
                    ...state.chatRooms.filter(msg => {
                        return msg._id !== action.msgId
                    })
                ]
            }

        case 'SET_CURR_CHAT_ROOM':
            return {
                ...state,
                currChatRoom: action.room
            }


        default:
            return state;
    }
}
