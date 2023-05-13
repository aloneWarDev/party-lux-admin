import { toast } from 'react-toastify';
import { GET_ERRORS, GET_GAMES, BEFORE_GAME, GET_GAME, EDIT_GAME, DELETE_GAME, ADD_GAME, GET_USERS_IN_GAMES, GET_SYNC_THEME_GAMES, GET_GENRES_IN_GAMES } from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from '../../config/config';
import { activity } from 'views/UserManagement/UserManagement.actions';
import axios from 'axios'
export const beforeGame = () => {
    return {
        type: BEFORE_GAME
    }
}

export const getGames = (qs = '', body = {}, toastCheck = true, search) => dispatch => {
    dispatch(emptyError());
    

    let url = `${ENV.url}games`;
    if (qs)
        url += `?${qs}`
    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('admin-accessToken'),
            'user-platform': 2

        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            if (search) {
                activity({ activityBy: localStorage.getItem('userID'), type: 5, activityOnModule: 'Games', activityOnId: null })
            }

            dispatch({
                type: GET_GAMES,
                payload: data
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


export const getGame = (gameId) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}games/get/${gameId}`;

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
                type: GET_GAME,
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
}
export const deleteGame = (Id) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}games/delete/${Id}`;
    
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
            activity({ activityBy: localStorage.getItem('userID'), type: 4, activityOnModule: 'Games', activityOnId: Id })
            dispatch({
                type: DELETE_GAME,
                payload: { gameId: Id }
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


export const getUser = async (Id) => {
    let url = `${ENV.url}user/${Id}`;

    const data = await axios({
        method: 'GET',
        url: url,
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        }
    })
    if (data.data.success) {
        return data.data.user;
    }
    else {
        return {};
    }
};



export const editGame = (Id, body = {}) => dispatch => {
    dispatch(emptyError());
    
    let url = `${ENV.url}games/edit/${Id}`;
    let data = new FormData();
    for (var v in body) {
        data.append(`${v}`, body[v]);
    }
    axios({
        method: 'PUT',
        url: url,
        data: data,
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
        },
    }).then(data => {
        if (data.data.success) {
            toast.success(data.data.message)
            activity({ activityBy: localStorage.getItem('userID'), type: 3, activityOnModule: 'Games', activityOnId: data.data.data?._id })
            dispatch({
                type: EDIT_GAME,
                payload: data.data.data
            })
        } else {
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




export const createGame = (body = {}) => dispatch => {
    dispatch(emptyError());
    
    let url = `${ENV.url}games/create`;
    let data = new FormData();
    for (var v in body) {
        data.append(`${v}`, body[v]);
    }
    axios({
        method: 'POST',
        url: url,
        data: data,
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
        }
    }).then(data => {
        if (data.data.success) {
            toast.success(data.data.message)
            activity({ activityBy: localStorage.getItem('userID'), type: 2, activityOnModule: 'Games', activityOnId: data.data.data?._id })
            dispatch({
                type: ADD_GAME,
                payload: data.data.data
            })
        } else {
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

export const getAllGenres = () => dispatch => {
    dispatch(emptyError());
    
    let url = `${ENV.url}games/get-all-genres`;

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
                type: GET_GENRES_IN_GAMES,
                payload: data.genres
            })
        } else {
            toast.error(data.message)
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

}

export const getAllUser = () => dispatch => {
    dispatch(emptyError());
    
    let url = `${ENV.url}games/get-all-users`;
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
                type: GET_USERS_IN_GAMES,
                payload: data
            })
        } else {
            toast.error(data.message)
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
}
//getSyncTheme  /theme-Sync/list
export const syncThemeList = (qs = '', body = {}) => dispatch => {
    
    dispatch(emptyError());
    let url = `${ENV.url}games/theme-Sync/list`;
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
            dispatch({
                type: GET_SYNC_THEME_GAMES,
                payload: data.data
            })
        } else {
            toast.error(data.message)
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

}    