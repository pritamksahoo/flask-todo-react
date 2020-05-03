import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Config from '../utils/config';
import history from '../utils/history';
import { Link } from 'react-router-dom';
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
        position: 'relative',
        cursor: 'pointer',
        padding: '1em 1em 2em 1em',
        margin: '0 0 1em 0',
        backgroundColor: 'wheat',
        color: 'brown'
    }

    newSpanStyle = {
        float: 'right',
    }

    newButtonStyle = {
        padding: '10px 15px',
        backgroundColor: 'green',
        color: 'white',
        outline: 'none',
        cursor: 'pointer',
        border: '1px solid green',
        borderRadius: '5px',
        fontSize: '14px'
    }

    newCreateForm = {
        backgroundColor: 'white',
        padding: '1em',
        float: 'right',
        position: 'relative',
        top: '3em',
        left: '9em',
        zIndex: '2',
        border: '2px solid burlywood',
        borderRadius: '5px'
    }

    actionSpan = {
        position: 'absolute',
        right: '1em',
        marginBottom: '1em'
    }

    delButton = {
        padding: '5px 5px',
        backgroundColor: 'red',
        color: 'white',
        outline: 'none',
        cursor: 'pointer',
        border: '1px solid red',
        borderRadius: '3px',
        zIndex: '1'
    }

    deleteBoard = (boardName) => {
        axios.post(this.backend_api + 'delete_board/', {
            username: this.props.username,
            board: boardName
        }, Config)
        .then((result) => {
            let response = result.data
            console.log(response)
            let [text, status_code] = response

            if (status_code === 200) {
                // console.log(text)
                this.setState({
                    boards: text,
                    message: '',
                })
            } else if (status_code == 404) {
                this.setState({
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

    createNewBoard = (event) => {
        event.preventDefault()
        let newBoard = event.target.newBoard.value

        if (newBoard !== undefined && newBoard !== '') {
            axios.post(this.backend_api + 'create_new_board/', {
                username: this.props.username,
                board: newBoard
            }, Config)
            .then((result) => {
                let response = result.data
                console.log(response)
                let [text, status_code] = response

                if (status_code === 200) {
                    // console.log(text)
                    this.setState({
                        boards: text,
                        message: '',
                        displayNewBoardForm: false
                    })
                } else if (status_code == 404) {
                    this.setState({
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


    }

    createNewBoardForm = () => {
        this.setState({
            displayNewBoardForm: true
        })
    }

    hideNewBoardForm = () => {
        this.setState({
            displayNewBoardForm: false,
            message: ''
        })
    }

    newBoardForm = () => {
        return (
            <div style={this.newCreateForm}>
                <form onSubmit={this.createNewBoard}>
                    Board Name : <input type="text" name="newBoard" id="newBoard"/><br></br><br></br>

                    <button type="submit">Create</button>&nbsp;&nbsp;
                    <button onClick={() => this.hideNewBoardForm()}>Dismiss</button>
                </form>
            </div>
        )
    }

    showBoards = () => {
        return (
            this.state.boards.map((item, pos) => {
                return (
                    <div key={pos} style={this.style}>
                        <Link to={{pathname: '/boards/' + item}}>{item}</Link>
                        <span style={this.actionSpan}>
                            <button style={this.delButton} onClick={() => this.deleteBoard(item)}>Del</button>
                        </span>
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
                <span style={this.newSpanStyle}>
                    <button style={this.newButtonStyle} onClick={() => this.createNewBoardForm()}> + &nbsp;Create New Board</button>
                </span>

                {
                    this.state.displayNewBoardForm 
                    ? this.newBoardForm()
                    : null
                }

                <h3>BOARDS</h3>
                
                <p>{this.state.message}</p><br></br>

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