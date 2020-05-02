import React, { Component } from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../store/actions/actions';
import history from '../utils/history';

import Boards from '../containers/boards';

class Routes extends Component {
    constructor(props) {
        super(props)

        this.state = {
            
        }
    }

    

    render() {
        return (
            <div>
                <Router history={history}>
                    <div>
                        <Switch>
                            {/* <Route exact path="/" render={() => <Container1 /> } /> */}
                            <Route exact path="/boards" render={() => <Boards message={''} /> } />
                        </Switch>
                    </div>
                </Router>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        'username': state.AuthReducer.user,
        'isAuthenticated': state.AuthReducer.isAuthenticated
    }
}

export default connect(mapStateToProps)(Routes);