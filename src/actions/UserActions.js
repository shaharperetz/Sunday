import UserService from '../services/UserService';
import { loading, doneLoading } from './SystemActions';

// import history from './../history';

// THUNK
export function loadUsers() {
  return async dispatch => {
    try {
      // example for loading
      dispatch(loading());
      const users = await UserService.getUsers();
      dispatch(setUsers(users));
    } catch (err) {
      console.log('UserActions: err in loadUsers', err);
      // example for rerouting - after changing the store
      // history.push('/some/path');
    } finally {
      dispatch(doneLoading());
    }
  };
}

export function loadOnlineUsers() {
  return async dispatch => {
    try {
      const users = await UserService.getOnline()
      console.log("loadOnlineUsers -> users", users)
      dispatch({ type: 'SET_ONLINE', users })
    } catch (err) {
      console.log('failed to get online users', err)
    }
  }
}
// THUNK
export function removeUser(userId) {
  return async dispatch => {
    try {
      await UserService.remove(userId);
      dispatch(_removeUser(userId));
    } catch (err) {
      console.log('UserActions: err in removeUser', err);
    }
  };
}
// THUNK
export function login(userCreds) {
  return async dispatch => {
    const user = await UserService.login(userCreds);
    dispatch(setUser(user));
  };
}
export function signup(userCreds) {
  return async dispatch => {
    const user = await UserService.signup(userCreds);
    dispatch(setUser(user));
  };
}
export function logout() {
  return async dispatch => {
    await UserService.logout();
    dispatch(setUser(null));
  };
}


export function setChatType(chatWith) {
  return async dispatch => {
    dispatch({ type: 'SET_USER_CHAT', chatWith })
  }
}

export function setUser(user) {
  return {
    type: 'SET_USER',
    user
  };
}
function setUsers(users) {
  return {
    type: 'SET_USERS',
    users
  };
}

function _removeUser(userId) {
  return {
    type: 'USER_REMOVE',
    userId
  };
}

/////////////////upload img /////////////////

export function upload(ev, user) {
  return async dispatch => {
    const newUser = await UserService.uploadImg(ev, user)
    if (!newUser) return
    dispatch({ type: 'UPDATE_USER', newUser })
  }
}