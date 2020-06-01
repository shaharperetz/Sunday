import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../style/pages/profile.css'
import { loadReviews, addReview } from '../actions/ReviewActions.js';
import { loadUsers } from '../actions/UserActions.js';
// import { Link } from 'react-router-dom';
import { setChatType, upload } from "../actions/UserActions";
import { setCurrChatRoom, loadRooms } from '../actions/ChatActions'
import { Button, ButtonGroup } from '@material-ui/core'
import WrappedMap from '../cmps/Map'


import UserService from '../../src/services/UserService'
import ChatService from '../services/ChatService';
import moment from 'moment'
import UserProfileEdit from '../cmps/UserProfileEdit';
class Profile extends Component {
    state = {
        user: null,
        isEdit: false
    };




    async componentDidMount() {
        await this.loadUser()

    }
    async  componentDidUpdate(prevProps) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            await this.loadUser()
        }
        // if (JSON.stringify(this.props.currBoard) !== JSON.stringify(prevProps.currBoard)) {
        //     this.loadboards()
        // }

    }

    loadUser = async () => {
        let user = await UserService.getById(this.props.match.params.id)
        this.setState({ user })
    }

    setPrivateChat = async (myId, toUserId) => {
        let chatWith = {
            id: { myId, toUserId },
            type: 'private'
        }

        await this.props.loadRooms()
        let allMsgs = this.props.chat.chatRooms
        let room = ChatService.getRoomById(chatWith, allMsgs)
        await this.props.setCurrChatRoom(room)
        await this.props.setChatType(chatWith)

    }


    uploadImg = async (ev, user) => {
        await this.props.upload(ev, user)
        this.loadUser()

    }
    toggleProfileEdit = () => {
        this.setState(({ isEdit }) => ({
            isEdit: !isEdit,
        }));
    };

    render() {
        const { user } = this.state
        return (
            <>


                {user && <div className="profile-page-container">
                    <label htmlFor="file-upload" className="custom-file-upload">
                        Change Profile Image
</label>
                    <div className="profile-header-container">

                        {user.imgUrl ? <img className="user-image-profile" src={user.imgUrl} alt="USER IMAGE" title={'Last seen: ' + moment(user.lastSeenAt).fromNow()}></img> :
                            <div className="profile-circle-big flex a-center j-center">{user.username.charAt(0).toUpperCase()}</div>}
                        <h2>{user.username} Profile</h2>
                        {user._id === this.props.match.params.id && <div className="toggle-edit-profile" onClick={this.toggleProfileEdit}> Edit Profile</div>}
                    </div>


                    {this.props.loggedInUser._id === user._id && <input onChange={(ev) => this.uploadImg(ev, user)} type="file" id="file-upload" className="upload" accept="image/png, image/jpeg" hidden></input>}
                    {this.state.isEdit ? <UserProfileEdit toggleProfileEdit={this.toggleProfileEdit}></UserProfileEdit> :
                        <div className="over-view-profile flex col">

                            <p className="over-view-header-text">Over View </p>
                            <p>Name: <span>{user.username}</span></p>
                            <p>Email: <span>{user.email}</span></p>
                            <p>Phone number: <span>{user.profile && user.profile.phone}</span></p>
                            <p>Birthday: <span>{user.profile && user.profile.birthday}</span></p>
                            {/* <p>Location: <span>{user.profile && user.profile.location}</span></p> */}
                            <p>Company: <span>{user.profile && user.profile.company}</span></p>
                            <p>Last Seen: <span>{moment(user.lastSeenAt).fromNow()}</span>{this.props.loggedInUser._id !== user._id && <button title="Click To Chat" className="chat-with-btn" onClick={() => this.setPrivateChat(this.props.loggedInUser._id, user._id)}>Chat With {user.username}</button>}</p>

                            {/* <WrappedMap></WrappedMap> */}
                        </div>}
                </div>}
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        reviews: state.review.reviews,
        users: state.user.users,
        loggedInUser: state.user.loggedInUser,
        userState: state.user,
        chat: state.chat
    };
};
const mapDispatchToProps = {
    loadReviews,
    loadUsers,
    addReview,
    setChatType,
    setCurrChatRoom,
    upload,
    loadRooms,


};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
