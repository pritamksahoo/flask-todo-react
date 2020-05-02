import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Config from '../utils/config';
import history from '../utils/history';
// import * as actions from '../store/actions/actions';

class Boards extends Component {
    constructor(props) {
        super(props)

        this.state = {
            // isLogIn: props.login,
            message: props.message
        }

        this.backend_api = 'http://0.0.0.0:8000/'
    }

    getBoards = (username) => {

        if (this.props.isAuthenticated) {

            axios.post(this.backend_api + 'get_all_boards/', {
                username: username,
            }, Config)
            .then((result) => {
                let response = result.data
                console.log(response)
                let [text, status_code] = response

                if (status_code === 200) {
                    // console.log(text)
                    this.setState({
                        boards: text,
                        message: ''
                    })
                } else {
                    this.setState({
                        message: text
                    })
                }
            })
            .catch((err) => {

            })

        } else {
            history.replace("/")
        }
    }

    style = {
        cursor: 'pointer',
        padding: '1em',
        margin: '0 0 1em 0',
        backgroundColor: 'wheat',
        color: 'brown'
    }

    showBoards = () => {
        return (
            this.state.boards.map((item, pos) => {
                return (
                    <div key={pos} style={this.style}>
                        {item}
                    </div>
                )
            })
        )
    }

    shouldComponentUpdate() {
        return true
    }

    render() {
        return (
            <div>
                <h3>BOARDS</h3>
                {/* {this.allBoards} */}
                {this.props.message}<br></br>
                {
                    this.state.boards 
                    ? this.showBoards()
                    : null
                }
            </div>
        )
    }

    componentDidMount() {
        this.getBoards(this.props.username)
    }
}

function mapStateToProps(state) {
    return {
        username: state.AuthReducer.user,
        'isAuthenticated': state.AuthReducer.isAuthenticated
    }
}

export default connect(mapStateToProps)(Boards);