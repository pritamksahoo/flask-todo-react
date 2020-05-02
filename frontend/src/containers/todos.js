import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Config from '../utils/config';
import history from '../utils/history';
import { Link } from 'react-router-dom';
// import * as actions from '../store/actions/actions';

class Todos extends Component {
    constructor(props) {
        super(props)

        this.state = {
            // isLogIn: props.login,
            message: props.message,
        }

        this.backend_api = 'http://0.0.0.0:8000/'
    }

    getTodos = (username) => {
        // this.board = board
        if (this.props.isAuthenticated) {

            axios.post(this.backend_api + 'get_all_todos/', {
                username: username,
                board: this.props.match.params.todo
            }, Config)
            .then((result) => {
                let response = result.data
                console.log(response)
                let [text, status_code] = response

                if (status_code === 200) {
                    // console.log(text)
                    this.setState({
                        todos: text,
                        message: '',
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

    descStyle = {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: 'rgb(100,84,85)'
    }

    showTodos = () => {
        let all_todos = this.state.todos.filter((item) => {
            if (!item.is_completed) {
                return true 
            }
        })

        return (
            all_todos.map((item, pos) => {
                return (
                    <div key={pos} style={this.style}>
                        <b>{item.name}</b> 
                        <hr></hr> 
                        <span style={this.descStyle}>
                            <b>Description : </b>
                            {item.desc}
                        </span>
                    </div>
                )
            })
        )
    }

    showDones = () => {
        let all_todos = this.state.todos.filter((item) => {
            if (item.is_completed) {
                return true 
            }
        })
        
        return (
            all_todos.map((item, pos) => {
                return (
                    <div key={pos} style={this.style}>
                        <b>{item.name}</b> 
                        <hr></hr> 
                        <span style={this.descStyle}>
                            <b>Description : </b>
                            {item.desc}
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
                <h3><Link to="/boards/">BOARDS</Link> >> {this.props.match.params.todo}</h3>
                {/* {this.allBoards} */}
                {this.props.message}<br></br>
                {
                    this.state.todos 
                    ? <div><h4>TO DO</h4>{this.showTodos()}<h4>DONE</h4>{this.showDones()}</div>
                    : null
                }
            </div>
        )
    }

    componentDidMount() {
        this.getTodos(this.props.username)
    }
}

function mapStateToProps(state) {
    return {
        username: state.AuthReducer.user,
        'isAuthenticated': state.AuthReducer.isAuthenticated
    }
}

export default connect(mapStateToProps)(Todos);