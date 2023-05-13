import { toast } from 'react-toastify';
import { GET_ERRORS, BEFORE_ACTIVITY, GET_ACTIVITIES , SEARCH_ACTIVITY} from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';

export const beforeActivity = () => {
    return {
        type: BEFORE_ACTIVITY
    }
}

export const getActivities = (qs = null , body={} ,search = false ) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}activity/list`;
    if (qs)
        url += `?${qs}`

    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body : JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            if (!qs){
                toast.success(data.message)
            }


            if(search){
                dispatch({
                    type: SEARCH_ACTIVITY,
                    payload: data.data
                })
            }else{
                dispatch({
                    type: GET_ACTIVITIES,
                    payload: data.data
                })
            }
            
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



