import { CREATE_PROMO  ,GET_PROMO ,  EDIT_PROMO  , DELETE_PROMO ,  BEFORE_PROMO ,  GET_PROMOS } from "redux/types"

const initialState ={

    promos: null , 
    getPromosAuth: false ,
    promo: null,
    getpromoAuth: false,
    delpromoAuth: false ,
    editpromoAuth: false,
    createAuth: false,


}
export default function(state  = initialState , action){
    switch(action.type){
        case GET_PROMO:
            return {
                ...state,
                promo: action.payload,
                getpromoAuth: true
            }
        case CREATE_PROMO:
            return {
                ...state,
                createAuth: true
            }
        case GET_PROMOS:
            return {
                ...state,
                promos: action.payload,
                getPromosAuth: true
            }
        case EDIT_PROMO:
            return {
                ...state,
                promo: action.payload,
                editpromoAuth: true
            }
        case DELETE_PROMO:
            return {
                ...state,
                promo: action.payload,
                delpromoAuth: true
            }
        case BEFORE_PROMO:
            return {
                ...state,
                promos: null , 
                getPromosAuth: false ,
                promo: null,
                getpromoAuth: false,
                delpromoAuth: false ,
                editpromoAuth: false,
                createAuth: false
            }
        default:
            return {
                ...state
            }
    }
}