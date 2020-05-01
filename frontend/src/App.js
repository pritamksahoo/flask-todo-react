import React, {Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import Account from './containers/account';

class App extends Component {

	backend_api = 'http://0.0.0.0:8000/'

	constructor(props) {
		super(props)
	}

	shouldComponentUpdate() {
		return true
	}

	// checkBackEnd = () => {
	// 	axios.get(this.backend_api + 'check/')
	// 	.then((response) => {
	// 		console.log(response.data)
	// 	})
	// 	.catch((err) => {
	// 		console.log(err)
	// 	})
	// }

	render() {
		return (
			<div className="App">
				{
					this.props.isAuthenticated === false
					? <Account login={true} message={''} />
					: <div></div>
				}
			</div>
		);
	}

	componentDidMount() {

	}
}

function mapStateToProps(state) {
	return {
		isAuthenticated: state.AuthReducer.isAuthenticated
	}
}

export default connect(mapStateToProps)(App);
