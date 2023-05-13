import { toast } from 'react-toastify';
import { GET_ERRORS , BEFORE_SEASON , GET_SEASONS , CREATE_SEASON , EDIT_SEASON , DELETE_SEASON , GET_SEASON_GAMES} from "redux/types"
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';
import axios from 'axios';
import { activity } from 'views/UserManagement/UserManagement.actions';


export const beforeSeason = ()=>{
    return {
        type: BEFORE_SEASON
    }
}

export const getSeasons = (qs = '',body = {}) => dispatch => {
    toast.dismiss()
    dispatch(emptyError());
    if(!qs){
        toast.dismiss()
    }

    let url = `${ENV.url}seasons/list`

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
            if (!qs){
                toast.success(data.message)
            }
            
            // if(search){
            //     activity({activityBy: localStorage.getItem('userID') , type: 5 , activityOnModule : 'Rewards', activityOnId: null})
            // }
            dispatch({
                type: GET_SEASONS,
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

export const createSeason = ( body ) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}seasons/create`;

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
            
            activity({ activityBy: localStorage.getItem('userID') , type: 2 , activityOnModule : 'Seasons', activityOnId: data?.seasons._id})
            dispatch({
                type: CREATE_SEASON,
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

export const editSeason = (Id , body) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}seasons/edit/${Id}`;

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
            activity({ activityBy: localStorage.getItem('userID') , type: 3 , activityOnModule : 'Seasons', activityOnId: Id})
            dispatch({
                type: EDIT_SEASON,
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

export const deleteSeason = (Id) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}seasons/delete/${Id}`;

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
            activity({activityBy: localStorage.getItem('userID') , type: 4 , activityOnModule : 'Seasons', activityOnId: Id})
            dispatch({
                type: DELETE_SEASON,
                payload: data.seasonId
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

//
export const getAllGames = ( qs = '' ) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}seasons/get-season-games`;
    if (qs)
        url += `?${qs}`
    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('admin-accessToken'),
            // 'user-platform': 2
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            // toast.success(data.message)
            // 
            dispatch({
                type: GET_SEASON_GAMES,
                payload: data.game
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





export const validateSeasonDate = (body,callback ) => dispatch => {
    
    dispatch(emptyError());
    let url = `${ENV.url}seasons/validate-date`;
  
    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json', 
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body:JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) 
        {
            
        }
        else 
        {
            dispatch({type: GET_ERRORS,payload: data})
        }
        if(callback)
            callback(data.success,data.message)
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({ type: GET_ERRORS, payload: error })
    })
}




export const validateSeasonDate_v2 = (body,callback ) => dispatch => {
    
    dispatch(emptyError());
    let url = `${ENV.url}seasons/validate-date-v2`;
  
    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json', 
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body:JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) 
        {
            
        }
        else 
        {
            dispatch({type: GET_ERRORS,payload: data})
        }
        if(callback)
        callback(data.success,data.message,data?.seasons)
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({ type: GET_ERRORS, payload: error })
    })
}