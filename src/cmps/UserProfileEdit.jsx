import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import LocalBoardService from "../services/LocalBoardService";
import HttpService from "../services/HttpService";
import UserService from "../services/UserService";
import { loadUsers, setUser } from "../actions/UserActions";

class UserProfileEdit extends Component {
  state = {
    // user.profile

    userProfile: this.props.currUser.profile
      ? this.props.currUser.profile
      : {
          title: "",
          email: "",
          phone: "",
          location: "",
          birthday: "",
          company: "",
        },
  };
  componentDidMount() {
    this.setProfileToRender();
  }

  componentDidUpdate(prevProps, prevState) {
    let { currUser } = this.props;
    if (JSON.stringify(currUser) !== JSON.stringify(prevProps.currUser)) {
      this.setProfileToRender();
    }
  }
  handleInput = ({ target }) => {
    const field = target.name;
    const value = target.type === "number" ? +target.value : target.value;
    this.setState((prevState) => {
      return {
        userProfile: {
          ...prevState.userProfile,
          [field]: value,
        },
      };
    });
  };
  onSaveUserProfile = async (ev) => {
    ev.preventDefault();
    const user = this.props.currUser;
    const profile = this.state.userProfile;
    user.profile = profile;
    const updatedUser = await UserService.update(user);
    sessionStorage.setItem("user", JSON.stringify(user));
    this.props.setUser(updatedUser);
    this.setProfileToRender(updatedUser);
  };
  setProfileToRender = () => {
    const user = this.props.currUser;
    console.log("setProfileToRender @@@@@@@@-> user ", user);
    if (user.profile) this.setState({ userProfile: user.profile });
    if (!user.profile) this.setState({ userProfile: this.state.userProfile });
  };

  render() {
    const userProfile = this.state.userProfile;
    console.log("render ->  userProfile", userProfile);
    return (
      <div className="user-profile flex col">
        <div
          className="back-btn-profile"
          onClick={this.props.toggleProfileEdit}
        >
          X
        </div>
        <form
          onSubmit={this.onSaveUserProfile}
          className="user-profile-form flex  col j-center a-center"
        >
          <div className="flex col">
            <div>
              <span>Name:</span>{" "}
              <input
                placeholder="Enter your Name"
                type="text"
                value={userProfile.title ? userProfile.title : ""}
                onChange={this.handleInput}
                name="title"
              />
            </div>
            <div>
              <span>Email:</span>
              <input
                placeholder="Enter a new Emaill"
                type="text"
                value={userProfile.email}
                onChange={this.handleInput}
                name="email"
              />
            </div>
            <div>
              <span>Company name:</span>
              <input
                placeholder="Company or Organization"
                type="text"
                value={userProfile.company}
                onChange={this.handleInput}
                name="company"
              />
            </div>
          </div>
          <div className="flex col">
            <div>
              <span>Phone:</span>
              <input
                placeholder="Enter your phone number"
                type="number"
                value={userProfile.phone}
                onChange={this.handleInput}
                name="phone"
              />
            </div>
            <div>
              <span>Address:</span>{" "}
              <input
                placeholder="Enter Your location"
                type="text"
                value={userProfile.location}
                onChange={this.handleInput}
                name="location"
              />
            </div>
            <div>
              <span>Birthday:</span>
              <input
                placeholder="Enter you birth date"
                type="date"
                value={userProfile.birthday}
                onChange={this.handleInput}
                name="birthday "
              />
            </div>
          </div>
          <button
            onClick={this.props.toggleProfileEdit}
            className="change-profile-submit"
            type="submit"
          >
            Save
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currUser: state.user.loggedInUser,
});

const mapDispatchToProps = {
  loadUsers,
  setUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileEdit);
