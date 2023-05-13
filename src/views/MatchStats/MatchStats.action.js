import { ENV } from './../../config/config';
import { BEFORE_MATCH_STATS , GET_ALL_MATCH_STATS , GET_ERRORS } from '../../redux/types'
import { emptyError } from 'redux/shared/error/error.action';

export const beforeMatchStats = ()=>{
    return {
        type : BEFORE_MATCH_STATS
    }
}

export const getAllMatchStats = (qs = '', body ={} ) => dispatch => {
    dispatch(emptyError())
    if(!qs){
        toast.dismiss()
    }

    let url = `${ENV.url}tournament/match-stats`;
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
                    type: GET_ALL_MATCH_STATS,
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
}