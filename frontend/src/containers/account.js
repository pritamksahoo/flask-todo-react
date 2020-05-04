import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Config from '../utils/config';
import * as actions from '../store/actions/actions';
import history from '../utils/history';
import '../css/account.css';

class Account extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLogIn: props.login,
            message: props.message
        }

        this.backend_api = 'http://0.0.0.0:8000/'
    }

    validateFormInput = (...args) => {
        for (let i=0; i<args.length; i++) {
            let item = args[i]

            if (item === '' || item === ' ' || item === undefined) {
                return false
            }
        }

        return true
    }

    handleLogIn = (event) => {
        event.preventDefault()

        let username = event.target.username.value
        let password = event.target.password.value

        if (!this.validateFormInput(username, password)) {
            return false
        }

        axios.post(this.backend_api + 'login/', {
            username: username,
            password: password
        }, Config)
        .then((result) => {
            let response = result.data
            let [text, status_code] = response

            if (status_code === 200) {
                this.props.login(username)
                history.replace("/boards/")
            } else {
                this.setState({
                    message: text
                })
            }
        })
        .catch((err) => {

        })
    }

    handleSignUp = (event) => {
        event.preventDefault()

        let username = event.target.username.value
        let password = event.target.password.value

        if (!this.validateFormInput(username, password)) {
            return false
        }

        axios.post(this.backend_api + 'signup/', {
            username: username,
            password: password
        })
        .then((result) => {
            let response = result.data
            let [text, status_code] = response
            if (status_code === 200) {
                this.setState({
                    isLogIn: true,
                    message: text
                })
            } else {
                this.setState({
                    message: text
                })
            }
        })
        .catch((err) => {

        })
    }

    toogleAction = () => {
        let action = this.state.isLogIn
        this.setState({
            isLogIn: !action,
            message: ''
        })
    }

    loginComponent = () => {
        return (
            <div className="account-div">
                <form className="account-form" onSubmit={this.handleLogIn}>
                    <h3 className="form-header">Log Into your account</h3>
                    <hr className="my-hr"></hr>

                    <p className="message account">{this.state.message}</p>

                    <label>Username</label><br></br>
                    <input type="text" name="username" placeholder="Enter username" id="username" required /><br></br><br></br>

                    <label>Password</label><br></br>
                    <input type="password" name="password" placeholder="Type your password" id="password" required /><br></br><br></br>
                    
                    <button type="submit">Login</button><br></br>
                    <p className="another-link">Don't have an account? <a href="#" className="switch-link" onClick={this.toogleAction}>Create one!</a></p>
                </form>
            </div>
        )
    }

    signupComponent = () => {
        return (
            <div className="account-div">
                <form className="account-form" onSubmit={this.handleSignUp}>
                <h3 className="form-header">Create your account</h3>
                    <hr className="my-hr"></hr>

                    <p className="message account">{this.state.message}</p>

                    <label>Username</label><br></br>
                    <input type="text" name="username" placeholder="Enter username" id="username" required /><br></br><br></br>

                    <label>Password</label><br></br>
                    <input type="password" name="password" placeholder="Type your password" id="password" required /><br></br><br></br>
                    
                    <button type="submit">Sign Up</button><br></br>
                    <p className="another-link">Already have an account? <a href="#" className="switch-link" onClick={this.toogleAction}>Log In</a></p>
                </form>
            </div>
        )
    }

    render() {
        return (
            <div>
                {
                    this.state.isLogIn
                    ? <this.loginComponent />
                    : <this.signupComponent />
                }
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        login: (username) => dispatch(actions.login(username))
    }
}

export default connect(null, mapDispatchToProps)(Account);