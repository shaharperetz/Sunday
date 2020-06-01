import React, { Component } from "react";
import { connect } from "react-redux";
import "../../style/cmps/chatPopup.css";
import { setChatType } from "../../actions/UserActions";
import SmallImg from "../../cmps/SmallImg";
import ChatService from "../../services/ChatService";
import LocalBoardService from "../../services/LocalBoardService";
import { loadBoards, setCurrBoard } from "../../actions/BoardActions";
import { setCurrChatRoom } from "../../actions/ChatActions";
import UserService from "../../services/UserService";
// import history from history
class UserChatPopup extends Component {
  state = {};

  makeRight = (idx) => {
    let right = idx * 5 + 7;
    return right;
  };

  setChat = async (chatRoom) => {
    let boards = this.props.boards;
    if (chatRoom.type === "board") {
      const newBoard = LocalBoardService.getById(boards, chatRoom.userA);
      await this.props.setCurrBoard(newBoard);
      this.props.history.push(`/board/${chatRoom.userA}`);
    }
    const myId = chatRoom.userA;
    const toUserId = chatRoom.userB;
    let chatWith = {
      id: { myId, toUserId },
      type: chatRoom.type,
    };
    await this.props.setChatType(chatWith);
    await this.props.setCurrChatRoom(chatRoom);
  };

  getToUserId = () => {
    if (!this.props.user) return;
    let myUser = this.props.user;
    const { chatRoom } = this.props;
    if (!chatRoom) return;
    if ((chatRoom && !chatRoom.userA) || (myUser && !myUser._id)) return;
    if (chatRoom.userA === myUser._id) {
      return chatRoom.userB;
    } else {
      return chatRoom.userA;
    }
  };

  getUserById = (toUserId) => {
    // await this.props.loadBoards();
    // let user = await UserService.getById(toUserId);

    let user = this.props.users.find((user) => user._id === toUserId);

    let boards = this.props.boards;
    if (!user) user = LocalBoardService.getById(boards, toUserId);

    return user;
  };

  /// needs to get a user Obj
  render() {
    const { chatRoom } = this.props;
    const toUserId = this.getToUserId();
    //
    const user = this.getUserById(toUserId);
    if (!toUserId || !user) return <></>;
    return (
      <div
        title={
          user && user.username ? user.username : user.name ? user.name : ""
        }
        onClick={() => this.setChat(chatRoom)}
        style={{ right: `${this.makeRight(this.props.idx)}vw` }}
        className="user-chat-popup-card slide-in-right"
      >
        <SmallImg
          isPopup={true}
          type={this.props.chatRoom.type}
          zindex={this.props.idx}
          url={user.imgUrl}
          name={user}
          key={this.props.idx}
          user={user}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.loggedInUser,
  chat: state.chat,
  boards: state.userBoards.board,
  users: state.user.users,
});

const mapDispatchToProps = {
  setChatType,
  loadBoards,
  setCurrChatRoom,
  setCurrBoard,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserChatPopup);
