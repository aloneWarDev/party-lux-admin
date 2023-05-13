import { toast } from 'react-toastify';
import { BEFORE_REWARD, CREATE_REWARD, DELETE_REWARD, EDIT_REWARD, GET_ERRORS, GET_REWARD, GET_REWARDS } from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';
import axios from 'axios';
import { activity } from 'views/UserManagement/UserManagement.actions';


export const beforeReward = () => {
    return {
        type: BEFORE_REWARD
    }
}

export const getRewards = (qs = '', body ={} , search) => dispatch => {
    
    if(!qs){
        toast.dismiss()
    }
    dispatch(emptyError());
    let url = `${ENV.url}reward/list`;
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

            
            if(search){
                activity({activityBy: localStorage.getItem('userID') , type: 5 , activityOnModule : 'Rewards', activityOnId: null})
            }

            dispatch({
                type: GET_REWARDS,
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
};



export const createReward = (body) => dispatch => {
    // 
    dispatch(emptyError());
    toast.dismiss()
    const url = `${ENV.url}reward/create`;

    let data = new FormData();
    for (var v in body) {
        data.append(`${v}`,body[v]);
    }

    axios({
        method: 'POST',
        url:url,
        data:data,
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
        }
    })
    .then(data => {

        if (data.data.success) {
            toast.success(data.data.message)
            
            activity({activityBy: localStorage.getItem('userID') , type: 2 , activityOnModule : 'Rewards', activityOnId: data.data.reward?._id })
            dispatch({
                type: CREATE_REWARD,
                payload: data.data.data
            })
        } 
        else {
            toast.error(data.data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data.data.data
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

export const updateReward = (rewardId , body) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    const url = `${ENV.url}reward/edit/${rewardId}`;
    
    
    let data = new FormData();
    for (var v in body) {
        data.append(`${v}`,body[v]);
    }

    axios({
        method: 'PUT',
        url:url,
        data:data,
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
        }
    })
    .then(data => {
       
        if (data.data.success) {
            toast.success(data.data.message)
            
            activity({activityBy: localStorage.getItem('userID') , type: 3 , activityOnModule : 'Rewards', activityOnId: data.data.reward?._id })
            dispatch({
                type: EDIT_REWARD,
                payload: data.data.data
            })
        } 
        else {
            toast.error(data.data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data.data.data
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

export const deleteReward = (newsId) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}reward/delete/${newsId}`;

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
            
            activity({activityBy: localStorage.getItem('userID') , type: 3 , activityOnModule : 'Rewards', activityOnId: data?.rewardId })
            dispatch({
                type: DELETE_REWARD,
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



export const getReward = (newsId) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}reward/get/${newsId}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            
            // toast.success(data.message) //just Temprarily commented
            dispatch({
                type: GET_REWARD,
                payload: data.reward
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