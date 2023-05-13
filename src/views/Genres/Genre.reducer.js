import { GET_ERRORS, BEFORE_GENRE, GET_GENRES, CREATE_GENRE, GET_GENRE, EDIT_GENRE, DELETE_GENRE } from '../../redux/types';

const initialState = {
    genres: null,
    genre: null,
    getGenresAuth: false,
    getGenreAuth: false,
    upsertGenreAuth: false,
    deleteGenreAuth: false,
    updateGenreAuth: false,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_GENRES:
            return{
                ...state , 
                genres: action.payload,
                getGenresAuth: true,
            }
        case GET_GENRE:
            return{
                ...state , 
                genre: action.payload,
                getGenreAuth: true,
            }
        case EDIT_GENRE:
            return{
                ...state , 
                genre: action.payload,
                updateGenreAuth: true,
            }
        case CREATE_GENRE:
            return{
                ...state , 
                genre: action.payload,
                upsertGenreAuth: true,
            }
        case DELETE_GENRE:
            return{
                ...state , 
                deleteGenreAuth: true,
            }
        case BEFORE_GENRE:
            return {
                ...state,
                genres: null,
                genre: null,
                getGenresAuth: false,
                getGenreAuth: false,
                updateGenreAuth: false,
                deleteGenreAuth: false,
                upsertGenreAuth: false,
            }
        default:
            return {
                ...state
            }
    }
}