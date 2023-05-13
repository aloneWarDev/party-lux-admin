import { toast } from 'react-toastify';
import { GET_ERRORS, BEFORE_SUPPORT, GET_SUPPORTS, EDIT_SUPPORT ,GET_SUPPORT_SDK , GET_SUPPORT_GAMES} from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from '../../config/config';
import { activity } from 'views/UserManagement/UserManagement.actions';

export const beforeSupport = () => {
    return {
        type: BEFORE_SUPPORT
    }
}
export const getSupports = (qs = '', body={}, moduleName , search) => dispatch => {
    dispatch(emptyError());
    if(!qs){
        toast.dismiss()   
    }
    let url = `${ENV.url}contacts/list`;
    if (qs)
        url += `?${qs}`

    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('admin-accessToken'),
            'user-platform' : 2

        },
        body : JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {

            if(search){
                activity({activityBy: localStorage.getItem('userID') , type: 5 , activityOnModule : moduleName , activityOnId: null})
            }
            dispatch({
                type: GET_SUPPORTS,
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

export const updateSupport = ( Id,body, method = 'PUT') => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    const url = `${ENV.url}contacts/edit/${Id}`;
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
            
            activity({activityBy: localStorage.getItem('userID') , type: 3 , activityOnModule : 'contact', activityOnId: data?.updatedContact?._id})
            dispatch({
                type: EDIT_SUPPORT,
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


export const getSdk = (qs = '') => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}contacts/get-sdk`;
    if (qs)
        url += `?${qs}`


    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('admin-accessToken')
            
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            // toast.success(data.message)
            dispatch({
                type: GET_SUPPORT_SDK,
                payload:  data.sdk
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

export const getSupportGames = (qs = '', body = {}) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}contacts/get-contact-games`;
    if (qs)
        url += `?${qs}`
    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('admin-accessToken')
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            // toast.success(data.message)
            // 
            dispatch({
                type: GET_SUPPORT_GAMES,
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
