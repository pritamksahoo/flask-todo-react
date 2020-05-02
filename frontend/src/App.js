import React, {Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Route, Router, Switch, Link, Redirect } from 'react-router-dom';
import * as actions from './store/actions/actions';
import history from './utils/history';

import Account from './containers/account';
import Boards from './containers/boards';
import Todos from './containers/todos';

import RootRedirect from './functional/rootRedirect';

class App extends Component {

	backend_api = 'http://0.0.0.0:8000/'

	constructor(props) {
		super(props)
	}

	shouldComponentUpdate() {
		return true
	}

	handleLogOut = (username) => {
        axios.post(this.backend_api + 'logout/', {
            username: username
        })
        .then((result) => {
            let response = result.data
            let [text, status_code] = response
            if (status_code === 200) {
				this.props.logout(username)
				history.replace("/account/")
            } else {
				alert(text)
            }
        })
        .catch((err) => {

        })
	}
	
	PrivateRoute = (pathTo, componentToRender) => {
        return (
            this.props.isAuthenticated === true 
            ? <Route exact path={pathTo} render={() => componentToRender} />
            : <Route exact path={pathTo} render={() => <Account login={true} message={''} />} />
        )
	}

	PrivateNoPropRoute = (pathTo, componentToRender) => {
        return (
            this.props.isAuthenticated === true 
            ? <Route exact path={pathTo} component={componentToRender} />
            : <Route exact path={pathTo} render={() => <Account login={true} message={''} />} />
        )
	}
	
	AuthRoute = (pathTo, componentToRender) => {
		// console.log("auth")
		return (
			this.props.isAuthenticated === false
			? <Route exact path={pathTo} render={() => componentToRender} />
			: <Route exact path="/boards" render={() => <Boards message={''} />} />
		)
	}

	render() {
		return (
			<div className="App">
				<Router history={history}>
					<div>
						{
							this.props.isAuthenticated
							? <div><button onClick={() => this.handleLogOut(this.props.username)}>Log Out</button></div>
							: <Link to={{pathname: '/account/'}}>LogIn</Link>
						}
						<hr></hr><br></br>
						<Switch>

							<Route exact path="/" render={() => <RootRedirect {...this.props} />} />
							
							{this.AuthRoute("/account/", <Account login={true} message={''} />)}

							{this.PrivateRoute("/boards/", <Boards message={''} />)}

							{this.PrivateNoPropRoute("/boards/:todo", Todos)}
						</Switch>
					</div>
				</Router>
			</div>
		);
	}

	componentDidMount() {

	}
}

function mapStateToProps(state) {
	return {
		isAuthenticated: state.AuthReducer.isAuthenticated,
		username: state.AuthReducer.user
	}
}

function mapDispatchToProps(dispatch) {
	return {
		logout: (username) => {
			dispatch(actions.logout(username))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
