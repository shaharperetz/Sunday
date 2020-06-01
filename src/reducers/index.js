import { combineReducers } from 'redux';
import ReviewReducer from './ReviewReducer'
import UserReducer from './UserReducer'
import SystemReducer from './SystemReducer';
import BoardReducer from './BoardReducer'
import ChatReducer from './ChatReducer';

const rootReducer = combineReducers({
  system: SystemReducer,
  review: ReviewReducer,
  user: UserReducer,
  userBoards: BoardReducer,
  chat: ChatReducer
})

export default rootReducer;