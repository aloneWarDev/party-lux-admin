import { BEFORE_SDK  , GET_SDKS , CREATE_SDK , EDIT_SDK , DELETE_SDK } from "redux/types";

const initialState = {
    sdks : [] ,
    sdk : null ,
    sdkId : null,
    deleteSdkAuth  : false ,
    createAuth : false,
    pagination: null,
    getSdksAuth : false,
    editSdkAuth : false ,
}

export default function(state = initialState , action){
    switch(action.type){
        case GET_SDKS:
            return{
                ...state ,
                sdks : action.payload.sdk ,
                pagination : action.payload.pagination,
                getSdksAuth : true
            }
        case  CREATE_SDK:
            return{
                ...state , 
                sdk : action.payload ,
                createAuth : true 
            }
        case EDIT_SDK:
            return{
                ...state ,
                sdk: action.payload ,
                editSdkAuth : true ,
            }
        case DELETE_SDK:
            return {
                ...state,
                sdkId: action.payload.sdkId,
                deleteSdkAuth: true
            }
        case BEFORE_SDK:
            return{
                ...state ,
                sdks : [] ,
                sdk : null ,
                sdkId : null ,
                deleteSdkAuth : false ,
                createAuth : false ,
                pagination : null ,
                getSdksAuth : false ,
                editSdkAuth : false ,
            }
        default:
            return{
                ...state 
            }
    }
}