import { toast } from 'react-toastify';
import { GET_SETTINGS, EDIT_SETTINGS, BEFORE_SETTINGS, GET_ERRORS, UPDATE_LEVEL_SETTINGS, LEVEL_SETTINGS, UPDATE_TROPHY_SETTINGS, TROPHY_SETTINGS } from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';

export const beforeSettings = () => {
    return {
        type: BEFORE_SETTINGS
    }
}

export const getSettings = (callback) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}settings/get`;
    
    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: GET_SETTINGS,
                payload: data.settings
            })
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
        callback()
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
        callback()

    })
};

export const editSettings = (body, qs = '',) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}settings/edit`;
    if (qs)
        url += `?${qs}`

    fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: EDIT_SETTINGS,
                payload: data.settings
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
export const updateLevelSettings = (body, qs = '',) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}settings/update-party-essential`;

    fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'content-type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: UPDATE_LEVEL_SETTINGS,
                payload: data.settings
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
export const getLevelSettings = () => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}settings/get-party-essential`;

    fetch(url, {
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: LEVEL_SETTINGS,
                payload: data.settings
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
export const updateTrophySettings = (body, qs = '',) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}settings/update-trophy-settings`;

    fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'content-type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: UPDATE_TROPHY_SETTINGS,
                payload: data.settings
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
export const getTrophySettings = () => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}settings/get-trophy-settings`;

    fetch(url, {
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: TROPHY_SETTINGS,
                payload: data.settings
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
