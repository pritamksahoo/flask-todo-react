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

    gridList = {
        display: 'grid',
        gridTemplateColumns: 'auto auto',
        gridGap: '5em',
        marginTop: 0
    }

    doneFlag = {
        float: 'right'
    }

    changeFlagButton =  {
        cursor: 'pointer',
        outline: 'none',
        border: '1px solid wheat',
        borderRadius: '4px',
        backgroundColor: 'white',
        margin: '0 0 1em 0',
        padding: '6px 10px'
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
        fontSize: '13px',
        zIndex: '1'
    }

    newCreateForm = {
        backgroundColor: 'white',
        padding: '1em',
        float: 'right',
        position: 'relative',
        top: '3em',
        left: '9em',
        zIndex: '1000',
        border: '2px solid burlywood',
        borderRadius: '5px'
    }

    completeTask = (taskName) => {
        axios.post(this.backend_api + 'complete_task/', {
            username: this.props.username,
            board: this.props.match.params.todo,
            task: taskName
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
    }

    inCompleteTask = (taskName) => {
        axios.post(this.backend_api + 'incomplete_task/', {
            username: this.props.username,
            board: this.props.match.params.todo,
            task: taskName
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
    }

    createNewTodo = (event) => {
        event.preventDefault()
        let newTodo = event.target.newTodo.value
        let description = event.target.description.value

        if (newTodo !== undefined && newTodo !== '') {
            axios.post(this.backend_api + 'create_new_todo/', {
                username: this.props.username,
                board: this.props.match.params.todo,
                todo: newTodo,
                description: description
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
                        displayNewTodoForm: false
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

    createNewTodoForm = () => {
        this.setState({
            displayNewTodoForm: true
        })
    }

    hideNewTodoForm = () => {
        this.setState({
            displayNewTodoForm: false,
            message: ''
        })
    }

    newTodoForm = () => {
        return (
            <div style={this.newCreateForm}>
                <form onSubmit={this.createNewTodo}>
                    TODO : <input type="text" name="newTodo" id="newTodo"/>
                    <br></br>
                    Description: <input type="text" name="description" id="description"/>
                    <br></br><br></br>
                    <button type="submit">Create</button>&nbsp;&nbsp;
                    <button onClick={() => this.hideNewTodoForm()}>Dismiss</button>
                </form>
            </div>
        )
    }

    showList = (all_todos, isCompleted=false) => {
        return (
            all_todos.map((item, pos) => {
                return (
                    <div key={pos} style={this.style}>
                        <span style={this.doneFlag}>
                            {
                                !isCompleted
                                ? <button style={this.changeFlagButton} onClick={() => this.completeTask(item.name)}>Complete Task</button>
                                : <button style={this.changeFlagButton} onClick={() => this.inCompleteTask(item.name)}>Back To TODO</button>
                            }
                        </span>

                        <b>{item.name}</b>

                        <br></br> 
                        <span style={this.descStyle}>
                            <b>Description : </b>
                            {item.desc}
                        </span>
                    </div>
                )
            })
        )
    }

    showTodos = () => {
        let all_todos = this.state.todos.filter((item) => {
            if (!item.is_completed) {
                return true 
            }
        })

        return this.showList(all_todos)
    }

    showDones = () => {
        let all_todos = this.state.todos.filter((item) => {
            if (item.is_completed) {
                return true 
            }
        })
        
        return this.showList(all_todos, true)
    }

    shouldComponentUpdate() {
        return true
    }

    render() {
        return (
            <div>

                <span style={this.newSpanStyle}>
                    <button style={this.newButtonStyle} onClick={() => this.createNewTodoForm()}> + &nbsp;Create New TODO</button>
                </span>

                {
                    this.state.displayNewTodoForm 
                    ? this.newTodoForm()
                    : null
                }

                <h3><Link to="/boards/">BOARDS</Link> >> {this.props.match.params.todo}</h3>
                {this.state.message}<br></br>
                {
                    this.state.todos 
                    ? <div style={this.gridList}>
                        <div>
                            <h4>TO DO</h4>{this.showTodos()}
                        </div>
                        <div>
                            <h4>DONE</h4>{this.showDones()}
                        </div>
                    </div>
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