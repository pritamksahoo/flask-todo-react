import React, {Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actions from './store/actions/actions';
// import Auth from './utils/auth';
import Routes from './routes/routes';

import Account from './containers/account';

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
            } else {
				alert(text)
            }
        })
        .catch((err) => {

        })
    }

	render() {
		return (
			<div className="App">
				{
					this.props.isAuthenticated === false
					? <Account login={true} message={''} />
					: <div>
						<button onClick={() => this.handleLogOut(this.props.username)}>Log Out</button><hr></hr>
						<Routes />
					</div>
				}
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
