import { BEFORE_ACTIVITY, GET_ACTIVITIES, SEARCH_ACTIVITY } from '../../redux/types';

const initialState = {
    activity: null,
    activityAuth: false,
    searchActivityAuth: false,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_ACTIVITIES:
            return {
                ...state,
                activity: action.payload,
                activityAuth: true
            }
        case SEARCH_ACTIVITY:
            return{
                ...state,
                activity: action.payload,
                searchActivityAuth: true
            }
        case BEFORE_ACTIVITY:
            return {
                ...state,
                activity: null,
                activityAuth: false,
                searchActivityAuth: false
            }
        default:
            return {
                ...state
            }
    }
}