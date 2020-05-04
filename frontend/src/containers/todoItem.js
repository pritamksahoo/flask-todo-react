import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Config from '../utils/config';
import history from '../utils/history';
import { Link } from 'react-router-dom';
import '../css/todos.css';

class TodoItem extends Component {

    componentDidUpdate () {
        setTimeout(() => {
            if (this.props.newlyDeleted) {
                this.props.toBeDeleted()
            }
        }, 200)
    }

    render() {
        return (
            <div className={"todo-item " + (this.props.newlyCreated ? "new-todo  " : " " + (this.props.newlyDeleted ? "delete " : ""))}>

                <div>
                    <details>
                        <summary>{this.props.item[0]}</summary>
                        <br></br>
                        <small><b>Description : </b>{this.props.item[1]}</small><br></br>
                        <small><b>Last Modified : </b>{this.props.item[2]}</small>
                    </details>
                    
                </div>

                <div className="action-span">
                    <button className="del-button" onClick={this.props.deleteTodo}>Del</button>&nbsp;
                    {
                        !this.props.item[3]
                        ? <button className="flag-button" onClick={this.props.completeTask}>Complete</button>
                        : <button className="flag-button" onClick={this.props.inCompleteTask}>Todo</button>
                    }
                </div>
            </div>
        )
    }
}

export default TodoItem;