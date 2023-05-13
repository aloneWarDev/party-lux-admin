import { toast } from 'react-toastify';
import { GET_ERRORS , GET_NEWS, BEFORE_NEW, DELETE_NEW, CREATE_NEW, GET_NEW, EDIT_NEW} from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';
import axios from 'axios';
import { activity } from 'views/UserManagement/UserManagement.actions';

export const beforeNew = () => {
    return {
        type: BEFORE_NEW
    }
}

export const getNews = (qs = '', body ={} , search) => dispatch => {
    dispatch(emptyError());
    if(!qs){
        toast.dismiss()
    }

    let url = `${ENV.url}news/list`;
    if (qs)
        url += `?${qs}`

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
            // 
            
            if(search){
                activity({activityBy: localStorage.getItem('userID') , type: 5 , activityOnModule : 'News', activityOnId: null})
            }
            dispatch({
                type: GET_NEWS,
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


export const createNews = (body) => dispatch => {
    // 
    dispatch(emptyError());
    toast.dismiss()
    let data = new FormData();
    for (var v in body) {
        data.append(`${v}`,body[v]);
    }

    const url = `${ENV.url}news/create`;
      axios({
        method: 'POST',
        url:url,
        data:data,
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
        }
    }).then(data => {
        if (data.data.success) {
            toast.success(data.data.message)
            activity({activityBy: localStorage.getItem('userID') , type: 2 , activityOnModule : 'News', activityOnId: data.data.news?._id })
            // 
            dispatch({
                type: CREATE_NEW,
                payload: data.data.news
            })
        } else {
            toast.error(data.data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data.data
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

export const updateNews = (newsId , body) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    const url = `${ENV.url}news/edit/${newsId}`;
    
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
    }).then(data => {
        
        if (data.data.success) {
            toast.success(data.data.message)
            
            activity({activityBy: localStorage.getItem('userID') , type: 3 , activityOnModule : 'News', activityOnId: data.data.news?._id })
            dispatch({
                type: EDIT_NEW,
                payload: data.data.news
            })
        } 
        else {
            toast.error(data.data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data.data
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

export const deleteNew = (newsId) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}news/delete/${newsId}`;

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
            activity({activityBy: localStorage.getItem('userID') , type: 4 , activityOnModule : 'News', activityOnId: data?.newsId ? data?.newsId : null })
            dispatch({
                type: DELETE_NEW,
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



export const getNew = (newsId) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}news/get/${newsId}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            // toast.success(data.message)
            dispatch({
                type: GET_NEW,
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