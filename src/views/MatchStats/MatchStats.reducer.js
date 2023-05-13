import { BEFORE_MATCH_STATS , GET_ALL_MATCH_STATS } from "redux/types";

const initialState ={
    matchesStats: null ,
    getMatchesStatsAuth: false,
}

const MatchStatsReducer = (state = initialState , action) => {
    switch (action.type) {
        case GET_ALL_MATCH_STATS:
            return{
                ...state ,
                matchesStats: action.payload ,
                getMatchesStatsAuth: true,                
            }
        case BEFORE_MATCH_STATS:
            return {
                ...state ,
                matchesStats: null ,
                getMatchesStatsAuth: false,
            }
        default:
            return {
                ...state
            }
    }
}
export default MatchStatsReducer;