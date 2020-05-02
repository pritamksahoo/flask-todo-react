import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Config from '../utils/config';
import * as actions from '../store/actions/actions';

class Account extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLogIn: props.login,
            message: props.message
        }

        this.backend_api = 'http://0.0.0.0:8000/'
    }

    handleLogIn = (event) => {
        event.preventDefault()

        let username = event.target.username.value
        let password = event.target.password.value

        axios.post(this.backend_api + 'login/', {
            username: username,
            password: password
        }, Config)
        .then((result) => {
            let response = result.data
            let [text, status_code] = response

            if (status_code === 200) {
                this.props.login(username)
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
            <div>
                <form onSubmit={this.handleLogIn}>
                    Username : <input type="text" name="username" id="username"/><br></br>
                    Password : <input type="password" name="password" id="password"/><br></br><br></br>
                    <button type="submit">Login</button>
                    &nbsp;&nbsp; <a href="#" onClick={this.toogleAction}>SignUp</a>
                </form>
            </div>
        )
    }

    signupComponent = () => {
        return (
            <div>
                <form onSubmit={this.handleSignUp}>
                    Username : <input type="text" name="username" id="username"/><br></br>
                    Password : <input type="password" name="password" id="password"/><br></br><br></br>
                    <button type="submit">Signup</button>
                    &nbsp;&nbsp; <a href="#" onClick={this.toogleAction}>Login</a>
                </form>
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.state.message}
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