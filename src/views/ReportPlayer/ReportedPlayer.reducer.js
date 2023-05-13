import { BEFORE_PLAYERREPORTS , EDIT_PLAYERREPORT ,  GET_PLAYERREPORTS , DELETE_PLAYERREPORT } from "../../redux/types"

const initialState ={

    playerReports: null , 
    getplayerReportsAuth: false ,
    playerReport: null,
    getplayerReportAuth: false,
    delplayerReportAuth: false ,
    updateAuth:false,
    // editpromoAuth: false,
    // createAuth: false,


}
export default function(state  = initialState , action){
    switch(action.type){
        case GET_PLAYERREPORTS:
            return {
                ...state,
                playerReports: action.payload,
                getplayerReportsAuth: true
            }
        case EDIT_PLAYERREPORT:
            return{
                ...state,
                playerReport: action.payload,
                updateAuth: true
            }
        case DELETE_PLAYERREPORT:
            return{
                ...state ,
                playerReport:action.payload,
                delplayerReportAuth:true
            }
        case BEFORE_PLAYERREPORTS:
            return {
                ...state,
                playerReports: null , 
                getplayerReportsAuth: false ,
                playerReport: null,
                getplayerReportAuth: false,
                delplayerReportAuth: false ,
                updateAuth:false
            }
        default:
            return {
                ...state
            }
    }
}