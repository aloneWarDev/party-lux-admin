import { GET_SETTINGS, EDIT_SETTINGS, BEFORE_SETTINGS, GET_ERRORS, UPDATE_LEVEL_SETTINGS, LEVEL_SETTINGS, UPDATE_TROPHY_SETTINGS, TROPHY_SETTINGS } from '../../redux/types';

const initialState = {
    settings: null,
    settingsAuth: false,
    levelsettings: null,
    levelsettingsAuth: false,
    getlevelsettingsAuth: false,
    trophysettings: null,
    trophysettingsAuth: false,
    gettrophysettingsAuth: false,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_SETTINGS:
            return {
                ...state,
                settings: action.payload,
                settingsAuth: true
            }
        case EDIT_SETTINGS:
            return {
                ...state,
                settings: action.payload,
                settingsAuth: true
            }
        case UPDATE_LEVEL_SETTINGS:
            return {
                ...state,
                levelsettings: action.payload,
                levelsettingsAuth: true
            }
        case LEVEL_SETTINGS:
            return {
                ...state,
                levelsettings: action.payload,
                getlevelsettingsAuth: true
            }
        case UPDATE_TROPHY_SETTINGS:
            return {
                ...state,
                trophysettings: action.payload,
                trophysettingsAuth: true
            }
        case TROPHY_SETTINGS:
            return {
                ...state,
                trophysettings: action.payload,
                gettrophysettingsAuth: true
            }
        case BEFORE_SETTINGS:
            return {
                ...state,
                settings: null,
                settingsAuth: false,
                levelsettings: null,
                levelsettingsAuth: false,
                getlevelsettingsAuth: false,
                trophysettings: null,
                trophysettingsAuth: false,
                gettrophysettingsAuth: false,
            }
        default:
            return {
                ...state
            }
    }
}