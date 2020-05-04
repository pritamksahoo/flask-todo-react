import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Config from '../utils/config';
import history from '../utils/history';
import { Link } from 'react-router-dom';
import '../css/todos.css';
import TodoItem from './todoItem';
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
                    todoDidCreate: false,
                    todoDidDelete: false,
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
                    todoDidCreate: false,
                    todoDidDelete: false,
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
        let description = event.target.newDesc.value

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
                        todoDidCreate: true,
                        todoDidDelete: false,
                        intendedTodoIndex: 0,
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

    deleteTodo = (taskName, pos, isCompleted) => {
        axios.post(this.backend_api + 'delete_todo/', {
            username: this.props.username,
            board: this.props.match.params.todo,
            todo: taskName,
        }, Config)
        .then((result) => {
            let response = result.data
            console.log(response)
            let [text, status_code] = response

            if (status_code === 200) {
                // console.log(text)
                this.setState({
                    // todos: text,
                    message: '',
                    todoDidDelete: true,
                    todoDidCreate: false,
                    intendedTodoIndex: pos,
                    isCompletedDelete: isCompleted
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
            <form onSubmit={this.createNewTodo}>
                <h4 className="form-header">CREATE NEW TODO</h4><hr className="my-hr"></hr>

                <label>Board Name</label>
                <br></br>
                
                <input type="text" name="newTddo" placeholder="Enter new task name" id="newTodo"/>
                <br></br><br></br>

                <label>Description</label>
                <br></br>

                <input type="text" name="newDesc" placeholder="Enter description" id="newDesc"/>
                <br></br>

                <button type="submit">Create</button>
            </form>
        )
    }

    toBeDeleted = (itemName) => {
        let todos = this.state.todos
        let pos = 0
        // boards.pop(pos)
        // console.log("boards:before", boards)

        for (let i=0; i<todos.length; i++) {
            if (todos[i] === itemName) {
                pos = i
                break
            }
        }

        todos = [...todos.slice(0, pos), ...todos.slice(pos+1, todos.length)]

        // console.log("boards:after", boards)

        this.setState({
            todos: todos,
            todoDidDelete: false,
            todoDidCreate: false
        })
    }

    showList = (all_todos, isCompleted=false) => {
        return (
            all_todos.map((item, pos) => {
                return (
                    <TodoItem 
                        key={`pos_${item[2]}`}

                        item={item} pos={pos}

                        deleteTodo={() => this.deleteTodo(item[0], pos, isCompleted)} 
                    
                        completeTask={() => this.completeTask(item[0])}

                        inCompleteTask={() => this.inCompleteTask(item[0])}

                        newlyCreated={this.state.todoDidCreate && this.state.intendedTodoIndex === pos && !isCompleted ? true : false} 
                    
                        newlyDeleted={this.state.todoDidDelete && this.state.intendedTodoIndex === pos && isCompleted === this.state.isCompletedDelete ? true : false} 

                        toBeDeleted={() => this.toBeDeleted(item[0])}
                    />

                )
            })
        )
    }

    showTodos = () => {
        let all_todos = this.state.todos.filter((item) => {
            if (!item[3]) {
                return true 
            }
        })

        return this.showList(all_todos)
    }

    showDones = () => {
        let all_todos = this.state.todos.filter((item) => {
            if (item[3]) {
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
            <div className="main-board">

                <div className="topbar">
                    <div className="menu">
                        <span className="navigate active">
                            <Link className="link" to="/boards/">BOARDS</Link>
                        </span>
                        <span className="navigate inactive">&nbsp;&nbsp;|&nbsp;&nbsp;{this.props.match.params.todo}</span>
                    </div>
                </div>

                <p className="message">{this.state.message}</p><br></br>

                <div className="content-todo">
                    <div className="createForm">
                        {this.newTodoForm()}
                    </div>

                    <div className="todos">
                        <h4 className="form-header">TODO</h4>
                        {
                            this.state.todos 
                            ? this.showTodos()
                            : null
                        }
                    </div>

                    <div className="dones">
                        <h4 className="form-header">DONE</h4>
                        {
                            this.state.todos 
                            ? this.showDones()
                            : null
                        }
                    </div>

                    
                </div>


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