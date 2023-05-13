import { toast } from 'react-toastify';
import { GET_ERRORS, GET_ALL_REWARDS, BEFORE_TOURNAMENT_REWARD, BEFORE_TOURNAMENT, GET_TOURNAMENT, DELETE_TOURNAMENT, UPSERT_TOURNAMENT, GET_GAME_TOURNAMENTS, EDIT_GAME_TOURNAMENT, DELETE_GAME_TOURNAMENT } from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from '../../config/config';
import { activity } from 'views/UserManagement/UserManagement.actions';
import axios from 'axios';

export const beforeTournament = () => {
    return {
        type: BEFORE_TOURNAMENT
    }
}

export const beforeTournamentRewards = () => {
    return {
        type: BEFORE_TOURNAMENT_REWARD
    }
}

export const getTournament = (qs = '', body = {}, toastCheck = true, search) => dispatch => {
    dispatch(emptyError());
    if (!qs) {
        toast.dismiss()
    }

    let url = `${ENV.url}tournament`;
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

            //search
            if (search) {
                activity({ activityBy: localStorage.getItem('userID'), type: 5, activityOnModule: 'Tournament', activityOnId: null })
            }

            dispatch({
                type: GET_TOURNAMENT,
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

export const createTournament = (body = {}) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}tournament/create`;
    let data = new FormData();
    if (body.gameParameters)
        body.gameParameters = JSON.stringify(body.gameParameters);
    for (var v in body)
        data.append(`${v}`, body[v]);

    axios({
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        url: url,
        data: data,

    }).then(data => {

        if (data.data.success) {
            toast.success(data.data.message)

            activity({ activityBy: localStorage.getItem('userID'), type: 2, activityOnModule: 'Tournament', activityOnId: data.data?._id })
            dispatch({
                type: UPSERT_TOURNAMENT,
                payload: { data: data.data }
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
};


export const editTournament = (Id, body = {}) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}tournament/edit/${Id}`;
    let data = new FormData();
    if (body.gameParameters)
        body.gameParameters = JSON.stringify(body.gameParameters)
    for (var v in body) {
        data.append(`${v}`, body[v]);
    }

    axios({
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        url: url,
        data: data
    }).then(data => {
        if (data.data.success) {
            toast.success(data.data.message)
            activity({ activityBy: localStorage.getItem('userID'), type: 3, activityOnModule: 'Tournament', activityOnId: data.data?._id })
            dispatch({
                type: UPSERT_TOURNAMENT,
                payload: { tournamentId: Id, data: data.data }
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
};

export const deleteTournament = (Id) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}tournament/delete`;

    fetch(url, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body: JSON.stringify({ tournamentId: Id })
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)

            activity({ activityBy: localStorage.getItem('userID'), type: 4, activityOnModule: 'Tournament', activityOnId: Id })
            dispatch({
                type: DELETE_TOURNAMENT,
                payload: { tournamentId: Id }
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

//gameTournament
export const getGameTournaments = (qs = '', body = {}, toastCheck = true, search) => dispatch => {
    dispatch(emptyError());
    if (!qs) {
        toast.dismiss()
    }

    let url = `${ENV.url}tournament/get-game-tournaments`;
    if (qs)
        url += `?${qs}`

    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: GET_GAME_TOURNAMENTS,
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
//editGameTournament
export const editGameTournament = (Id, body = {}) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}tournament/edit-game-tournament/${Id}`;

    let formData = new FormData()
    for (const key in body)
        formData.append(key, body[key])

    fetch(url, {
        method: 'PUT',
        headers: {
            // 'content-type': 'multipart/form-data',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body: formData
    }).then(res => res.json()).then(data => {
        if (data.success) {

            toast.success(data.message)
            // activity({activityBy: localStorage.getItem('userID') , type: 3 , activityOnModule : 'Tournament', activityOnId: data.data?._id})
            dispatch({
                type: EDIT_GAME_TOURNAMENT,
                payload: { tournamentId: Id, data: data.data }
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

//deleteGameTournament
export const deleteGameTournament = (Id) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}tournament/delete-game-tournament`;

    fetch(url, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body: JSON.stringify({ tournamentId: Id })
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)

            // activity({activityBy: localStorage.getItem('userID') , type: 4 , activityOnModule : 'Tournament', activityOnId: Id})
            dispatch({
                type: DELETE_GAME_TOURNAMENT,
                payload: { tournamentId: Id }
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





export const getRewards = (qs = '', body = {}, search = null, callback = null) => dispatch => {

    if (!qs) {
        toast.dismiss()
    }
    dispatch(emptyError());
    let url = `${ENV.url}tournament/all-rewards`;
    if (qs) {
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

        // alert('Yo')
        if (data.success) {
            // if (!qs){
            //     toast.success(data.message)
            // }
            // 
            // if(search){
            //     activity({activityBy: localStorage.getItem('userID') , type: 5 , activityOnModule : 'Rewards', activityOnId: null})
            // }
            if (callback) {
                callback(data?.reward)
            }
            dispatch({ type: GET_ALL_REWARDS, payload: data.reward })
        }
        else {
            if (!qs)
                toast.error(data.message)
            dispatch({ type: GET_ERRORS, payload: data })
        }
    })
        .catch(error => {
            if (error.response && error.response.data) {
                const { data } = error.response
                if (data.message)
                    toast.error(data.message)
            }
            dispatch({ type: GET_ERRORS, payload: error })
        })
};


export const getUserTournaments = (qs = '', Id, body, callback) => dispatch => {
    toast.dismiss()
    dispatch(emptyError());
    let url = `${ENV.url}tournament/get-tornament-participations/${Id}`;
    if (qs) {
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

            if (callback) {
                callback(data.data)
            }
        }
        else {
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
        dispatch({ type: GET_ERRORS, payload: error })
    })

}

export const getPlayerTournamentTransaction = (qs = '', Id, body, callback) => dispatch => {
    toast.dismiss()
    dispatch(emptyError());
    let url = `${ENV.url}tournament/get-player-participation-payment/${Id}`;
    if (qs) {
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

            if (callback) {
                callback(data.data)
            }
        }
        else {
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
        dispatch({ type: GET_ERRORS, payload: error })
    })


}
