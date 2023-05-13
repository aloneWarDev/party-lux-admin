import { BEFORE_THEME , ADD_THEME , GET_THEMES , EDIT_THEME , GET_THEME ,DELETE_THEME , GET_GAME_THEMES , GET_GAME_THEME , EDIT_GAME_THEME , DELETE_GAME_THEME} from "redux/types";

const initialState = {
    themes : null ,
    getThemesAuth : false ,
    theme: null,
    gameTheme : null,
    createThemeAuth : false,
    getThemeAuth: false ,
    editThemeAuth: false ,
    delThemeAuth: false ,
    gameThemes: null ,
    getGameThemesAuth: false,
    getGameThemeAuth: false ,
    editGameThemeAuth: false,
    delGameThemeAuth: false

}

export default function( state = initialState , action){
    switch(action.type){
        case BEFORE_THEME :
            return{
                ...state ,
                themes : null ,
                getThemesAuth : false ,
                theme: null,
                createThemeAuth : false,
                getThemeAuth: false ,
                editThemeAuth: false ,
                delThemeAuth: false ,
                gameThemes: null ,
                getGameThemesAuth: false ,
                delGameThemeAuth: false
            }
        case GET_THEME:
            return {
                ...state,
                theme: action.payload,
                getThemeAuth: true
            }
        case ADD_THEME:
            return{
                ...state ,
                theme: action.payload , 
                createThemeAuth: true
            }
        case EDIT_THEME:
            return{
                ...state,
                theme: action.payload,
                editThemeAuth: true
            }
        case GET_THEMES:
            return {
                ...state,
                themes: action.payload,
                getThemesAuth: true
            }
        case DELETE_THEME:
            return{
                ...state,
                theme: action.payload,
                delThemeAuth: true
            }
        case GET_GAME_THEMES:
            return{
                ...state,
                gameThemes: action.payload ,
                getGameThemesAuth: true
            }
        case GET_GAME_THEME:
            return{
                ...state,
                gameTheme: action.payload ,
                getGameThemeAuth: true ,
            }
        case EDIT_GAME_THEME:
            return{
                ...state,
                gameTheme : action.payload ,
                editGameThemeAuth : true ,
            }
        case DELETE_GAME_THEME:
            return{
                ...state,
                gameTheme: action.payload ,
                delGameThemeAuth: true ,
            }
        default:
            return{
                ...state
            }
    }
}