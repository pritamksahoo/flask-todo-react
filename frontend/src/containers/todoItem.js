import React, { Component } from 'react';
import '../css/todos.css';

class TodoItem extends Component {

    constructor(props) {
        super(props)

        this.delTodoBtn = React.createRef()
        this.flagBtn = React.createRef()
    }

    componentDidUpdate () {
        setTimeout(() => {
            if (this.props.newlyDeleted) {
                this.props.toBeDeleted()
            }
        }, 200)
    }

    disableDelBtn = () => {
        this.delTodoBtn.current.setAttribute("disabled", "disabled")
    }

    enableDelBtn = () => {
        if (this.flagBtn.current) {
            this.flagBtn.current.removeAttribute("disabled")
        }
    }

    disableFlagBtn = () => {
        this.flagBtn.current.setAttribute("disabled", "disabled")
    }

    enableFlagBtn = () => {
        if (this.flagBtn.current) {
            this.flagBtn.current.removeAttribute("disabled")
        }
    }

    render() {
        return (
            <div className={"todo-item " + (this.props.newlyCreated ? "new-todo  " : " " + (this.props.newlyDeleted ? "delete " : ""))}>

                <div className="left-span">
                    <details>
                        <summary>{this.props.item[0]}</summary>
                        <br></br>
                        <small><b>Description : </b>{this.props.item[1]}</small><br></br>
                        <small><b>Last Modified : </b>{this.props.item[2]}</small>
                    </details>
                    
                </div>

                <div className="action-span">
                    <button ref={this.delTodoBtn} className="del-button" onClick={() => {this.disableDelBtn(); this.props.deleteTodo(); this.enableDelBtn();}}>Del</button>&nbsp;
                    {
                        !this.props.item[3]
                        ? <button ref={this.flagBtn} className="flag-button" onClick={() => {this.disableFlagBtn(); this.props.completeTask(); this.enableFlagBtn();}}>Complete</button>
                        : <button ref={this.flagBtn} className="flag-button" onClick={() => {this.disableFlagBtn(); this.props.inCompleteTask(); this.enableFlagBtn(); }}>Todo</button>
                    }
                </div>
            </div>
        )
    }
}

export default TodoItem;