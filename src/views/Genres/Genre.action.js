import { toast } from 'react-toastify';
import { GET_ERRORS, BEFORE_GENRE, GET_GENRES, CREATE_GENRE, GET_GENRE, EDIT_GENRE, DELETE_GENRE } from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from '../../config/config';
import { activity } from 'views/UserManagement/UserManagement.actions';
import axios from 'axios';
export const beforeGenre = () => {
    return {
        type: BEFORE_GENRE
    }
}

export const getGenres = (qs = '', body = {}, toastCheck ,search ) => dispatch => {
    dispatch(emptyError());
    if(!qs && toastCheck){
        toast.dismiss()
    }
    let url = `${ENV.url}memberships/list`;
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

            // if(search){
            //     activity({activityBy: localStorage.getItem('userID') , type: 5 , activityOnModule : 'Genre', activityOnId: null})
            // }
            dispatch({
                type: GET_GENRES,
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

export const addGenre = (body) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    const url = `${ENV.url}genres/create`;
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
            'x-auth-token': ENV.x_auth_token
        },
    }).then(data => {
        if (data.data.success) {

            toast.success(data.data.message)
            
            activity({activityBy: localStorage.getItem('userID') , type: 2 , activityOnModule : 'Genre', activityOnId: data?.genre?._id})
            dispatch({
                type : CREATE_GENRE,
                payload: data.data.genre
            })
        } else {
            toast.error(data.data.message)
            dispatch({
                type : CREATE_GENRE,
                payload: data.data.genre
            })
            // dispatch({
            //     type: GET_ERRORS,
            //     payload: data
            // })
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
export const updateGenre = (body) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    const url = `${ENV.url}genres/edit`;
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
        },
    }).then(data => {
        if (data.data.success) {
            
            toast.success(data.data.message)
            
            activity({activityBy: localStorage.getItem('userID') , type: 3 , activityOnModule : 'Genre', activityOnId: data.data.genre._id})
            dispatch({
                type: EDIT_GENRE,
                payload: data.data.genre
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

export const deleteGenre = (genreId) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}genres/delete/${genreId}`;

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
            
            activity({activityBy: localStorage.getItem('userID') , type: 4 , activityOnModule : 'Genre', activityOnId: data?.genreId})
            dispatch({
                type: DELETE_GENRE,
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


export const getGenre = (memberId) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}memberships/get/${memberId}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            // toast.success(data.message) //temprarily commented
            dispatch({
                type: GET_GENRE,
                payload: data.genre
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
