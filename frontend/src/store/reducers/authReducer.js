import * as actionTypes from '../actions/actionTypes';

const initialState = {
    isAuthenticated: false
}

const AuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOG_IN:
            return {
                ...state,
                isAuthenticated: true
            }

        default:
            return state
    }
}

export {AuthReducer};