import React, {Component} from 'react';
import axios from 'axios';

class App extends Component {

	backend_api = 'http://0.0.0.0:8000/'

	constructor(props) {
		super(props)
	}

	shouldComponentUpdate() {
		return true
	}

	checkBackEnd = () => {
		axios.get(this.backend_api + 'check/')
		.then((response) => {
			console.log(response.data)
		})
		.catch((err) => {
			console.log(err)
		})
	}

	render() {
		return (
			<div className="App">
				<button onClick={() => this.checkBackEnd()}>Hello, world</button>
			</div>
		);
	}

	componentDidMount() {

	}
}

export default App;
