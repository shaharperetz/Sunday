import React, { Component } from "react";
import { connect } from "react-redux";
import { Launcher } from "react-chat-window";
import "../../style/cmps/chat.css";
import SocketService from "../../services/SocketService";
import UserService from "../../services/UserService";
import { loadUsers } from "../../actions/UserActions";
import UserChatList from "../../cmps/Chat/UserChatList";

import {
  saveRoom,
  setCurrChatRoom,
  loadRooms,
} from "../../actions/ChatActions";

import {
  saveBoard,
  loadBoards,
  removeBoard,
  setCurrBoard,
} from "../../actions/BoardActions";
import ChatService from "../../services/ChatService";
class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messageList: [],
      newMessagesCount: 0,
      chatRoom: null,
      isOpen: false,
    };
  }

  componentDidMount = async () => {
    await this.startChat();
  };

  componentDidUpdate = async (prevProps) => {
    if (
      JSON.stringify(prevProps.userState.chatWith) !==
      JSON.stringify(this.props.userState.chatWith)
    ) {
      let { type } = this.props.userState.chatWith;
      if (type === "private") {
        SocketService.off("private_room_new_msg", this.renderMessage);
      } else {
        SocketService.off("board_room_new_msg", this.renderMessage);
      }
      await this.startChat();
    }
  };
  // Add A Msg popup
  newMessagePopup = () => {
    const { isOpen, newMessagesCount } = this.state;
    if (!isOpen) {
      this.setState({ newMessagesCount: newMessagesCount + 1 });
    }
  };
  // Render A msg
  renderMessage = (msg) => {
    this.newMessagePopup();
    let author = "them";
    if (msg.msg.senderId === this.props.user._id) author = "me";
    msg.msg.author = author;
    this.setState({
      messageList: [...this.state.messageList, msg.msg],
    });

    /// Update data Messegae
  };

  startChat = async () => {
    this.setState({ newMessagesCount: 0 });
    if (!this.props.userState.chatWith) return;
    // Get The room By Id// will return null if it didnt found
    await this.props.loadRooms();
    let room = ChatService.getRoomById(
      this.props.userState.chatWith,
      this.props.chat.chatRooms
    );
    // Theres no Room ? Create one
    const { id, type } = this.props.userState.chatWith;
    if (!room) {
      // create new room
      let chatRoom = ChatService.createNewRoom(
        this.props.userState.chatWith,
        this.state.messageList,
        id,
        type
      );

      // Send to server
      // let allChatRooms = this.props.chat.chatRooms
      this.props.saveRoom(chatRoom);

      this.setState({ chatRoom });
    } else {
      // Else Take the room History And render on chat
      await this.props.setCurrChatRoom(room);
      let chatRoom = this.props.currChatRoom;
      let chatMsgsByUser = this.chatMsgByUser(chatRoom, this.props.user);
      // Add Sorted Msgs by User to the room history
      chatRoom.roomHistory = chatMsgsByUser;
      await this.props.saveRoom(chatRoom);
      this.setState({
        messageList: chatMsgsByUser,
        chatRoom: this.props.currChatRoom,
      });
    }
    // Add Socket Listeners And Join rooms by type
    if (type === "private") {
      SocketService.emit("join_private_room", this.props.userState.chatWith);
      SocketService.on("private_room_new_msg", this.renderMessage);
    } else {
      SocketService.emit("join_board_room", id);
      SocketService.on("board_room_new_msg", this.renderMessage);
    }
  };

  // Capitilize First letter
  capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  //Sending message
  _onMessageWasSent = async (message) => {
    message.senderId = this.props.user._id;
    let user = this.props.user;
    let capName = this.capitalize(this.props.user.username);
    message.data.name = "" + capName + ":";
    message.data.isSeen = [];
    message.data.isSeen.push(user);
    this.setState({
      messageList: [...this.state.messageList, message],
    });

    let { type } = this.props.userState.chatWith;
    let chatWith = this.props.userState.chatWith;
    chatWith.msg = message;
    if (type === "private") {
      SocketService.emit("private_room_new_msg", chatWith);
    } else {
      SocketService.emit("board_room_new_msg", chatWith);
    }
    let chatRoom = this.state.chatRoom;
    if (chatRoom && chatRoom.roomHistory) {
      chatRoom.roomHistory.push(message);
    } else {
      return;
    }
    await this.props.saveRoom(chatRoom);
    // await this.props.setCurrChatRoom(chatRoom);
  };

  _sendMessage(text) {
    if (text.length > 0) {
      this.setState({
        messageList: [
          ...this.state.messageList,
          {
            author: "them",
            type: "text",
            data: { text },
          },
        ],
      });
    }
  }

  chatMsgByUser = (chatRoom, myUser) => {
    let chatMsgsByUser = chatRoom.roomHistory.map((msg) => {
      let author = "them";
      if (msg && msg.senderId === myUser._id) {
        author = "me";
      } else {
        let isSeen = false;
        msg.data.isSeen.forEach((seenUser) => {
          if (myUser._id === seenUser._id) isSeen = true;
        });
        if (!isSeen) {
          this.newMessagePopup();
          msg.data.isSeen.push(myUser);
        }
      }
      author = "me";
      msg.author = author;
      return msg;
    });

    return chatMsgsByUser;
  };

  _handleClick() {
    this.setState({
      newMessagesCount: 0,
    });
  }
  // Get Correct User to show
  getUser = (chatWith) => {
    if (!chatWith) return;
    const { board, users } = this.props;
    let user = ChatService.getUser(chatWith, board, users);
    return user;
  };
  _handleClick() {
    this.setState({
      isOpen: !this.state.isOpen,
      newMessagesCount: 0,
    });
  }

  render() {
    const { chatWith } = this.props.userState;
    const { board } = this.props;
    let user = this.getUser(chatWith);
    return (
      <div>
        <Launcher
          agentProfile={{
            teamName: `${user && user.username}`,
            imageUrl: `${user && user.imgUrl && user.imgUrl}`,
          }}
          onMessageWasSent={this._onMessageWasSent.bind(this)}
          messageList={this.state.messageList}
          showEmoji
          newMessagesCount={this.state.newMessagesCount}
          handleClick={this._handleClick.bind(this)}
          isOpen={this.state.isOpen}
          mute={false}
        />
        {this.state.isOpen && (
          <UserChatList history={this.props.history}></UserChatList>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  //State of the store to props of the cmp
  return {
    boards: state.userBoards.board,
    board: state.userBoards.currBoard,
    user: state.user.loggedInUser,
    userState: state.user,
    users: state.user.users,
    chat: state.chat,
    currChatRoom: state.chat.currChatRoom,
  };
};
const mapDispatchToProps = {
  saveBoard,
  removeBoard,
  loadBoards,
  setCurrBoard,
  loadUsers,
  saveRoom,
  setCurrChatRoom,
  loadRooms,
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
