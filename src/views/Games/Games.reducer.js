import { GET_GAMES, BEFORE_GAME, GET_GAME, ADD_GAME, EDIT_GAME, DELETE_GAME, GET_USERS_IN_GAMES, GET_SYNC_THEME_GAMES, GET_GENRES_IN_GAMES } from '../../redux/types';

const initialState = {
    gameId: null,
    games: null,
    genres: null,
    getGenresAuth: false,
    game: null,
    users: null,
    syncThemes: [],
    getSyncThemesAuth: false,
    pagination: null,
    deleteGameAuth: false,
    editGameAuth: false,
    insertGameAuth: false,
    getGamesAuth: false,
    getGameAuth: false,
    getUsersGameAuth: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_GAME:
            return {
                ...state,
                game: action.payload,
                insertGameAuth: true
            }
        case EDIT_GAME:
            return {
                ...state,
                game: action.payload,
                editGameAuth: true
            }
        case DELETE_GAME:
            return {
                ...state,
                gameId: action.payload.gameId,
                deleteGameAuth: true
            }
        case GET_GAMES:
            return {
                ...state,
                games: action.payload.games,
                pagination: action.payload.pagination,
                getGamesAuth: true
            }
        case GET_GENRES_IN_GAMES:
            return {
                ...state,
                genres: action.payload,
                getGenresAuth: true
            }
        case GET_GAME:
            return {
                ...state,
                game: action.payload,
                getGameAuth: true
            }
        case BEFORE_GAME:
            return {
                ...state,
                gameId: null,
                //    games: null,
                //    game:null,
                users: null,
                syncThemes: [],
                getSyncThemesAuth: false,
                getUsersGameAuth: false,
                pagination: null,
                deleteGameAuth: false,
                insertGameAuth: false,
                editGameAuth: false,
                getGamesAuth: false,
                getGameAuth: false,
            }
        case GET_USERS_IN_GAMES:
            return {
                ...state,
                users: action.payload.users,
                getUsersGameAuth: true
            }
        case GET_SYNC_THEME_GAMES:
            return {
                ...state,
                syncThemes: action.payload.games,
                pagination: action.payload.pagination,
                getSyncThemesAuth: true,
            }
        default:
            return {
                ...state
            }
    }
}