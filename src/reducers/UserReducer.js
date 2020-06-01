let localLoggedinUser = null;
if (sessionStorage.user) localLoggedinUser = JSON.parse(sessionStorage.user);

const initialState = {
  loggedInUser: localLoggedinUser,
  users: [],
  chatWith: null,
  onlineUsers: []

};

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, loggedInUser: action.user };
    case 'USER_REMOVE':
      return {
        ...state,
        users: state.users.filter(user => user._id !== action.userId)
      };
    case 'SET_USERS':
      return { ...state, users: action.users };
    case 'SET_USER_CHAT':
      return { ...state, chatWith: action.chatWith };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.filter(user => {
          if (user._id === action.newUser._id) return action.newUser
          return user
        })
      }
    case 'SET_ONLINE':
      return {
        ...state,
        onlineUsers: action.users
      }
    default:
      return state;
  }
}
