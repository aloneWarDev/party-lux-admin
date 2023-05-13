import { toast } from 'react-toastify';
import { GET_ERRORS , BEFORE_SDK  , GET_SDKS , CREATE_SDK , EDIT_SDK , DELETE_SDK} from "redux/types"
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';
import axios from 'axios';
import { activity } from 'views/UserManagement/UserManagement.actions';


export const beforeSdk = ()=>{
    return {
        type: BEFORE_SDK
    }
}

export const getSdks = (qs = '',body = {}) => dispatch => {
    dispatch(emptyError());
    
    
    let url = `${ENV.url}sdk/list`
    if (qs){
        url += `?${qs}`
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            // if(search){
            //     activity({activityBy: localStorage.getItem('userID') , type: 5 , activityOnModule : 'Rewards', activityOnId: null})
            // }
            dispatch({
                type: GET_SDKS,
                payload: data.data
            })
        } else {
            if (!qs)
                toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    })
    .catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
}

export const createSdk = ( body ) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}sdk/create`;

    
    fetch(url , {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body : JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if(data.success){
            toast.success(data.message)
            dispatch({
                type: CREATE_SDK,
                payload: data.data
            })
        }else{
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    })
    .catch( error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
}

export const editSdk = (Id , body) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}sdk/edit/${Id}`;

    fetch(url , {
        method : 'PUT',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body : JSON.stringify(body)
    })
    .then(res => res.json()).then( data => {
        if(data.success){
            
            toast.success(data.message)
            dispatch({
                type: EDIT_SDK,
                payload: data.data
            })
        }else{
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data.data
            })
        }
    })
    .catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })

}

export const deleteSdk = (Id) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}sdk/delete`;

    fetch(url, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body: JSON.stringify({sdkId :Id})
    }).then(res => res.json()).then(data => {
        if (data.success) {
            

            toast.success(data.message)
            // activity({activityBy: localStorage.getItem('userID') , type: 4 , activityOnModule : 'Games', activityOnId: Id})
            dispatch({
                type: DELETE_SDK,
                payload: { sdkId: Id } 
            })
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};