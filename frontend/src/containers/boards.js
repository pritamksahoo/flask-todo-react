import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Config from '../utils/config';
import history from '../utils/history';
import { Link } from 'react-router-dom';

import '../css/boards.css';
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
        color: 'brown',
        // zIndex: '5'
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
        // zIndex: '-1',
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
        // zIndex: '1'
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
            } else if (status_code === 404) {
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
            <form onSubmit={this.createNewBoard}>
                <h4 className="form-header">CREATE NEW BOARD</h4><hr className="my-hr"></hr>

                <label>Board Name</label>
                <br></br>
                
                <input type="text" name="newBoard" placeholder="Enter new board name" id="newBoard"/>
                <br></br>

                <button type="submit">Create</button>
            </form>
        )
    }

    showBoards = () => {
        return (
            this.state.boards.map((item, pos) => {
                return (
                    <BoardItem item={item} pos={pos} deleteBoard={() => this.deleteBoard(item)} />
                )
            })
        )
    }

    shouldComponentUpdate() {
        return true
    }

    render() {
        return (
            <div className="main-board">
                <div className="topbar">
                    <div className="menu">
                        <span className="navigate inactive">BOARDS</span>
                    </div>
                </div>
                
                <p className="message">{this.state.message}</p><br></br>
                
                <div className="content">
                    <div className="boards">
                        {
                            this.state.boards 
                            ? this.showBoards()
                            : null
                        }
                    </div>

                    <div className="createForm">
                        {this.newBoardForm()}
                    </div>
                </div>
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

class BoardItem extends Component {

    componentDidMount() {
        // document.addEventListener("click", this.closeMenu);
    }

    componentWillUnmount() {
        // let timeout = 2
    }

    render () {
        return (
            <div key={this.props.pos} className="board-item">
                <div onClick={() => {history.replace("/boards/" + this.props.item)}}>
                    <Link className="board-link" to={{pathname: '/boards/' + this.props.item}}>
                        {this.props.item}
                    </Link>
                    
                </div>

                <div className="action-span">
                    <button className="del-button" onClick={this.props.deleteBoard}>Del</button>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(Boards);