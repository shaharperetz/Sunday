import React, { Component } from "react";
import { FacebookProvider, LoginButton } from "react-facebook";

export default class Facebook extends Component {
  handleResponse = ({ profile }) => {
    debugger;
    const name = profile.name;
    const email = profile.email;
    const id = profile.id;
    const imgUrl = profile.picture.data.url;
    this.props.signUpFacebook(email, id, name, imgUrl);
  };

  handleError = (error) => {
    this.setState({ error });
  };

  render() {
    return (
      <div className="facebook-login">
        <FacebookProvider appId="273810577170429">
          <LoginButton
            scope="email"
            onCompleted={this.handleResponse}
            onError={this.handleError}
          >
            <span>Login via Facebook</span>
          </LoginButton>
        </FacebookProvider>
      </div>
    );
  }
}
