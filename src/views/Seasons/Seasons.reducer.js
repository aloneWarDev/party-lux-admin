import { BEFORE_SEASON , GET_SEASONS , CREATE_SEASON , EDIT_SEASON , DELETE_SEASON , GET_SEASON_GAMES} from "redux/types";

const initialState = {
    seasons : [] ,
    games: [],
    season : null ,
    seasonId : null,
    pagination: null,
    getSeasonsAuth : false,
    deleteSeasonAuth  : false ,
    createAuth : false,
    editSeasonAuth : false ,
    getGamesAuth: false ,
}

export default function(state = initialState , action){
    switch(action.type){
        case GET_SEASONS:
            return{
                ...state ,
                seasons : action.payload.seasons ,
                pagination : action.payload.pagination,
                getSeasonsAuth : true
            }
        case  CREATE_SEASON:
            return{
                ...state , 
                season : action.payload ,
                createAuth : true 
            }
        case EDIT_SEASON:
            return{
                ...state ,
                season: action.payload ,
                editSeasonAuth : true ,
            }
        case DELETE_SEASON:
            return {
                ...state,
                seasonId: action.payload.seasonId,
                deleteSeasonAuth: true
            }
        case GET_SEASON_GAMES:
            return{
                ...state ,
                games: action.payload,
                getGamesAuth: true,
            }
        case BEFORE_SEASON:
            return{
                ...state ,
                seasons : [] ,
                games: [] ,
                season : null ,
                seasonId : null ,
                deleteSeasonAuth : false ,
                createAuth : false ,
                pagination : null ,
                getSeasonsAuth : false ,
                editSeasonAuth : false ,
                getGamesAuth: false ,
            }
        default:
            return{
                ...state 
            }
    }
}