import React from 'react';
import { Router, Switch, Route } from 'react-router';
import { connect } from 'react-redux'
import { loadUsers, loadOnlineUsers } from './actions/UserActions'
import { loadBoards, setCurrBoard } from './actions/BoardActions'
import history from './history';
import './App.css';
import './style/main.css';
import Login from './pages/Login.js';
import Signup from './pages/Signup.js';
import Boards from './pages/Boards';
import SideNav from './cmps/SideNav';
import BoardNav from './cmps/Board/BoardNav';
import ProgressBar from './cmps/Statistics/ProgressBar'
import MyWeek from './pages/MyWeek'
import Inbox from './pages/Inbox';
import Home from './pages/Home';
import TaskDetails from './cmps/Tasks/TaskDetails';
import LabelContainer from './cmps/Columns/LabelContainer';
import FilterByText from './cmps/Filters/FilterByText';
import Profile from './pages/Profile.js';
import SocketService from './services/SocketService';
import Chat from './cmps/Chat/Chat';
import DoughnutChart from './cmps/Statistics/DoughnutChart'
import Notifications from './cmps/Notifications';
import ConfirmDialog from './cmps/Board/ConfirmDialog';
import Facebook from './cmps/Facebook';
class App extends React.Component {
  state = {
    notificationsIsShown: false,
    chatWith: null
  }
  async componentDidMount() {
    SocketService.setup()

    console.log("App -> componentDidMount -> window.location.href", window.location.href)

    if (!this.props.currUser) {
      let redirect = true
      if (window.location.href.includes('login')) redirect = false
      if (window.location.href.includes('signup')) redirect = false
      if (window.location.href.includes('home')) redirect = false
      if (redirect) history.push('/home/')




    } else {

      SocketService.emit('login', this.props.currUser)

    }


    await this.props.loadUsers()
    await this.props.loadBoards()
    await this.props.loadOnlineUsers()
    const { boards } = this.props
    if (boards && boards.length > 0) {

      let board = boards[0]
      this.props.setCurrBoard(board)
    }
    const { currUser } = this.props
    if (this.props.boards && !this.props.boards.length > 0) return
    this.setState({
      currUser, chatWith: {
        id: this.props.boards[0]._id,
        type: 'board'
      }
    })

  }



  getBoardByID = (id) => {
    const { boards } = this.props;
    const board = boards.find(board => {
      return board._id === id
    })
    return board
  }

  componentWillUnmount() {
    SocketService.terminate()
  }




  setPrivateChat = (userId, toUserId) => {

    this.setState({
      chatWith: {
        id: { userId, toUserId },
        type: 'private'
      }
    })
  }



  toggleNotifications = () => {
    this.setState(({ notificationsIsShown }) => ({
      notificationsIsShown: !notificationsIsShown,
    }));
  };

  logOut = (ev) => {
    ev.stopPropagation()
    sessionStorage.clear();
    history.push('/login')

  }



  render() {

    return (
      <div className="App flex">
        <Router history={history}>


          {this.props.currUser && <SideNav logOut={this.logOut} toggleNotifications={this.toggleNotifications} user={this.props.currUser}></SideNav>}
          {this.props.currUser && <BoardNav></BoardNav>}
          {this.props.currUser && this.props.board && <Notifications notificationsIsShown={this.state.notificationsIsShown} toggleNotifications={this.toggleNotifications}></Notifications>}

          {this.props.currUser && this.props.board && this.props.chatWith && <Chat history={history} user={this.props.currUser} ></Chat>}




          <section className="main-board-container">
            <Switch>
              <Route path="/" component={Boards} exact />
              <Route path="/home" component={Home} exact />
              <Route path="/board/:id?" component={Boards} exact />
              <Route path="/board/guest/:GuestMode?" component={Boards} exact />
              <Route path="/signup" component={Signup} exact />
              <Route path="/login" component={Login} exact />
              <Route path="/progress" component={ProgressBar} exact />
              <Route path="/myweek" component={MyWeek} exact />
              <Route path="/user/inbox" component={Inbox} exact />
              <Route path="/details" component={TaskDetails} exact />
              <Route path="/profile/:id?" component={Profile} exact />
            </Switch>
            <div className="loading-container fade-out">
              <div className="col-sm-2">
                <div id="nest6"></div>
              </div>
            </div>
          </section >
        </Router >

      </div >
    );
  }
}
const mapStateToProps = (state) => ({
  currUser: state.user.loggedInUser,
  board: state.userBoards.currBoard,
  boards: state.userBoards.board,
  chatWith: state.user.chatWith,
  onlineUsers: state.user.onlineUsers
});
const mapDispatchToProps = {
  loadUsers,
  loadBoards,
  setCurrBoard,
  loadOnlineUsers
};
export default connect(mapStateToProps, mapDispatchToProps)(App);