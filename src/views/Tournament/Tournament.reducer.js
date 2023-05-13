import { BEFORE_TOURNAMENT, GET_TOURNAMENT, UPSERT_TOURNAMENT, DELETE_TOURNAMENT , GET_GAME_TOURNAMENTS , EDIT_GAME_TOURNAMENT ,DELETE_GAME_TOURNAMENT , GET_ALL_REWARDS , BEFORE_TOURNAMENT_REWARD} from '../../redux/types';

const initialState = {
    tournaments: null,
    rewards:null,
    getRewardsAuth:false,
    getTournamentsAuth: false,
    tournamentId: null,
    tournament:null,
    getTournamentAuth: false,
    pagination: null,
    deleteTournamentAuth: false,
    upsertTournamentAuth: false,
    gameTournaments: null,
    getGameTournamentsAuth: false,
    gameTournament: null ,
    editGameTournamentAuth: false,
    deleteGameTournamentAuth: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case UPSERT_TOURNAMENT:
            return {
                ...state,
                tournament: action.payload,
                upsertTournamentAuth: true
            }
        case DELETE_TOURNAMENT:
            return {
                ...state,
                tournamentId: action.payload.tournamentId,
                deleteTournamentAuth: true
            }
        case GET_TOURNAMENT:
            // alert(JSON.stringify(action.payload))
            return {
                ...state,
                tournaments: action.payload.tournaments,
                pagination: action.payload.pagination,
                getTournamentsAuth: true
            }
        case GET_GAME_TOURNAMENTS:
            return{
                ...state ,
                gameTournaments: action.payload , 
                getGameTournamentsAuth: true ,
            }
        case EDIT_GAME_TOURNAMENT:
            return{
                ...state,
                gameTournament: action.payload,
                editGameTournamentAuth: true,
            }
        case DELETE_GAME_TOURNAMENT:
            return{
                ...state,
                tournamentId: action.payload.tournamentId ,
                deleteGameTournamentAuth: true
            }
        case GET_ALL_REWARDS:
            return{
                ...state,
                rewards: action.payload,
                getRewardsAuth: true
            }  
        case BEFORE_TOURNAMENT_REWARD:
            return{
                ...state,
                getRewardsAuth: false
            }
        case BEFORE_TOURNAMENT:
            return {
                ...state,
                tournament: null,
                getTournamentAuth: false,
                tournaments: null,
                getTournamentsAuth: false,
                pagination: null,
                deleteTournamentAuth: false,
                upsertTournamentAuth: false,
                tournamentId: null ,
                gameTournaments: null ,
                getGameTournamentsAuth: false ,
                gameTournament: null ,
                editGameTournamentAuth: false ,
                deleteGameTournamentAuth:false,
            }
        default:
            return {
                ...state
            }
    }
}