import { toast } from 'react-toastify';
import { BEFORE_PLAYERREPORTS ,  GET_PLAYERREPORTS , EDIT_PLAYERREPORT , DELETE_PLAYERREPORT ,  GET_ERRORS} from "../../redux/types"
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from '../../config/config';
import axios from 'axios';

export const  beforePlayerReport =() =>{
    return {
        type: BEFORE_PLAYERREPORTS
    }
}

export const playerReportlist =(qs=''  , body={} ) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}reportedUser/list`;
    if (qs){
        url += `?${qs}`
    }
        
    // 
    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if(data.success){
            // 
            dispatch({
                type: GET_PLAYERREPORTS,
                payload: data.data
            })
        }
        else{
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

export const deleteReportedPlayer = (playerReportId) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}reportedUser/delete/${playerReportId}`;

    fetch(url, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            // 
            // activity({activityBy: localStorage.getItem('userID') , type: 3 , activityOnModule : 'Promos', activityOnId: data?.promoId })
            dispatch({
                type: DELETE_PLAYERREPORT,
                payload: data
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


export const updatePlayerReport = ( Id,body, method = 'PUT') => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    const url = `${ENV.url}reportedUser/edit/${Id}`;
    fetch(url, {
        method,
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            // 
            // activity({activityBy: localStorage.getItem('userID') , type: 3 , activityOnModule : 'contact', activityOnId: data?.updatedContact?._id})
            dispatch({
                type: EDIT_PLAYERREPORT,
                payload: data
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