import React, { Component } from "react";
import { connect } from "react-redux";
import "../../style/cmps/chatPopup.css";
import {
  saveBoard,
  loadBoards,
  setCurrBoard,
} from "../../actions/BoardActions";
import { loadRooms } from "../../actions/ChatActions";
import { loadUsers } from "../../actions/UserActions";
import UserChatPopup from "./UserChatPopup";
import ChatService from "../../services/ChatService";
class UserChatList extends Component {
  state = {
    chats: null,
  };
  async componentDidMount() {
    await this.props.loadUsers();
    await this.props.loadRooms();
    const { chatRooms } = this.props.chat;
    this.setState({ chats: chatRooms });
  }

  componentDidUpdate(prevProps) {
    const { chatRooms } = this.props.chat;
    if (
      JSON.stringify(chatRooms) !== JSON.stringify(prevProps.chat.chatRooms)
    ) {
      this.setState({ chats: chatRooms });
    }
  }

  filterChatsByUser = () => {
    if (!this.state.chats) return [];
    const { chats } = this.state;
    // if (!chatRooms) return;
    let sortedRooms = ChatService.filterChatsByUser(chats, this.props.user);
    return sortedRooms;
  };
  /// needs to get a Open Chat Array Obj
  render() {
    let chatRooms = this.filterChatsByUser();
    return (
      <>
        {chatRooms.length > 0 && (
          <div className="user-chat-popup-container">
            {chatRooms.map((chatRoom, idx) => {
              if (idx > 5) return;
              return (
                <UserChatPopup
                  history={this.props.history}
                  key={idx}
                  idx={idx}
                  chatRoom={chatRoom}
                  users={this.props.users}
                ></UserChatPopup>
              );
            })}
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  chat: state.chat,
  user: state.user.loggedInUser,
  users: state.users,
});

const mapDispatchToProps = {
  saveBoard,
  loadBoards,
  setCurrBoard,
  loadRooms,
  loadUsers,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserChatList);
