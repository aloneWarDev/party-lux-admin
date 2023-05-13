import { BEFORE_SUPPORT, GET_SUPPORTS, EDIT_SUPPORT ,GET_SUPPORT_SDK , GET_SUPPORT_GAMES} from '../../redux/types';

const initialState = {
    sdk : [],
    games : [] ,
    getGamesAuth : false ,
    getSdkAuth : false ,
    supports: null,
    supportsAuth: false,
    support: null,
    updateAuth: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_SUPPORTS:
            return {
                ...state,
                supports: action.payload,
                supportsAuth: true
            }
        case EDIT_SUPPORT:
            return {
                ...state,
                support: action.payload,
                updateAuth: true
            }
        case GET_SUPPORT_SDK:
            return {
                ...state,
                sdk: action.payload,
                getSdkAuth: true
            }   
        case GET_SUPPORT_GAMES:
            return {
                ...state,
                games: action.payload,
                getGamesAuth: true
            }
        case BEFORE_SUPPORT:
            return {
                ...state,
                supports: null,
                support: null ,
                supportsAuth: false,
                updateAuth: false,
            }
        default:
            return {
                ...state
            }
    }
}