import {  GET_NEWS, BEFORE_NEW, DELETE_NEW, CREATE_NEW, GET_NEW, EDIT_NEW } from '../../redux/types';

const initialState = {
    news: null,
    getNewsAuth: false,
    new: null,
    delNewAuth: false,
    createAuth: false,
    getNewAuth: false,
    editNewAuth: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_NEW:
            return {
                ...state,
                new: action.payload,
                getNewAuth: true
            }
        case CREATE_NEW:
            return {
                ...state,
                new: action.payload,
                createAuth: true
            }
        case GET_NEWS:
            return {
                ...state,
                news: action.payload,
                getNewsAuth: true
            }
        case EDIT_NEW:
            return {
                ...state,
                new: action.payload,
                editNewAuth: true
            }
        case DELETE_NEW:
            return {
                ...state,
                new: action.payload,
                delNewAuth: true
            }
        case BEFORE_NEW:
            return {
                ...state,
                news: null,
                getNewsAuth: false,
                new: null,
                delNewAuth: false,
                createAuth: false,
                getNewAuth: false,
                editNewAuth: false
            }
        default:
            return {
                ...state
            }
    }
}