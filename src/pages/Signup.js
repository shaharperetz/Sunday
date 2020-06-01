import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../style/pages/signup.css'
import {
    loadUsers,
    removeUser,
    login,
    logout,
    signup
} from '../actions/UserActions';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Avatar from '@material-ui/core/Avatar';
import Facebook from '../cmps/Facebook';


class Signup extends Component {
    state = {
        signupCred: {
            email: '',
            password: '',
            username: '',
            history: [],

        }
    };



    signupHandleChange = ev => {
        const { name, value } = ev.target;
        this.setState(prevState => ({
            signupCred: {
                ...prevState.signupCred,
                [name]: value
            }
        }));
    };

    doLogin = async (email, password) => {
        // const { email, password } = this.state.loginCred;
        if (!email || !password) {
            return
        }
        const userCreds = { email, password };
        this.props.login(userCreds);
        this.setState({ loginCred: { email: '', password: '' } });
    };

    doSignup = async ev => {
        ev.preventDefault();
        const { email, password, username, history } = this.state.signupCred;
        console.log("Signup -> history", history)
        if (!email || !password || !username) {
            return this.setState({ msg: 'All inputs are required!' });
        }
        const signupCreds = { email, password, username, history };
        await this.props.signup(signupCreds);
        this.doLogin(email, password)
        this.setState({ signupCred: { email: '', password: '', username: '' } });
    };

    signUpFacebook = (email, id, name, imgUrl) => {
        console.log("Signup -> signUpFacebook -> imgUrl", imgUrl)

        const history = [];
        const signUpCreds = { email, password: id, username: name, history, imgUrl }
        this.props.signup(signUpCreds)
        this.doLogin(email, id)
    }

    removeUser = userId => {
        this.props.removeUser(userId);
    };
    render() {

        return (
            <div className="signup-form-container">
                <div className="text-float">
                    <h2 className="fade-in">Pursue your passion <br />We'll Manage It</h2>
                </div>
                <div className="text-float-2">
                    <h2 className="fade-in2"> Organized Inspiration</h2>
                </div>
                <div className="text-float-3">
                    <h2 className="fade-in3"> Let us Organize Your Chaos</h2>
                </div>
                <form className="signup-form flex col a-center" onSubmit={this.doSignup}>
                    <Avatar>
                    </Avatar>
                    <h3>Start Your Revolution</h3>
                    <TextField
                        type="text"
                        name="email"
                        value={this.state.signupCred.email}
                        onChange={this.signupHandleChange}
                        placeholder="Email"
                        required


                        variant="outlined"
                        fullWidth
                        id="email"
                        label="Email Address"
                        autoComplete="email"
                    />
                    <br />
                    <TextField
                        name="password"
                        type="password"
                        value={this.state.signupCred.password}
                        onChange={this.signupHandleChange}
                        placeholder="Password"
                        required
                        variant="outlined"
                        fullWidth
                        label="Password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <br />
                    <TextField
                        type="text"
                        variant="outlined"
                        fullWidth
                        name="username"
                        value={this.state.signupCred.username}
                        onChange={this.signupHandleChange}
                        placeholder="Username"
                        required
                    />
                    <br />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Sign Up
          </Button>


                    <Link href="/login" variant="body2">
                        Already have an account? Sign in
              </Link>
                    <Facebook signUpFacebook={this.signUpFacebook} />


                </form>

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        users: state.user.users,
        loggedInUser: state.user.loggedInUser,
        isLoading: state.system.isLoading
    };
};
const mapDispatchToProps = {
    login,
    logout,
    signup,
    removeUser,
    loadUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);



