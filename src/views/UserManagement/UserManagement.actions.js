import { toast } from 'react-toastify';
import { GET_ERRORS, BEFORE_USER, GET_USERS, DELETE_USER , UPSERT_USER} from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';
import axios from 'axios';

export const beforeUser = () => {
    return {
        type: BEFORE_USER
    }
}
export const createUser = (body={}) => dispatch => {
    // 
    dispatch(emptyError());
    // toast.dismiss()
    let url = `${ENV.url}user/create`;
    let data = new FormData();
    for (var v in body) {
        data.append(`${v}`,body[v]);
    }
    // 
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
            // 
            toast.success(data.data.message)
            activity({ activityBy: localStorage.getItem('userID') , type: 2 , activityOnModule : 'User', activityOnId: data.data.data._id})
            dispatch({
                type: UPSERT_USER,
                payload: data.data.data
            })
        } else {
            toast.error(data.data.message)
            // dispatch({
            //     type: GET_ERRORS,
            //     payload: data.data.data
            // })
            dispatch({
                type: UPSERT_USER,
                payload:''
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
export const editUser = (Id , body={} ) => dispatch =>{
    // 
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}user/edit/${Id}`;
    let data = new FormData();
    for (var v in body) {
        data.append(`${v}`,body[v]);
    }
    axios({
        method: 'PUT',
        url , 
        data:data,
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
    }).then(data => {
        if (data.data.success) {
            toast.success(data.data.message)
            activity({ activityBy: localStorage.getItem('userID') , type: 3 , activityOnModule : 'User', activityOnId: data.data.user._id})
            // 
            dispatch({
                type: UPSERT_USER,
                payload: data.data.user
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
}
export const getUsers = (qs = '', body = {}, moduleName ,search , toastCheck = true   ) => dispatch => {
    dispatch(emptyError());
    if (!qs) {
        toast.dismiss()
    }
    let url = `${ENV.url}user/list`;
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
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            if(search){
                activity({ activityBy: localStorage.getItem('userID') , type: 5 , activityOnModule : moduleName , activityOnId: null}) 
            }
            dispatch({
                type: GET_USERS,
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

export const deleteUser = (Id) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}user/delete/${Id}`;

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
            
            activity({ activityBy: localStorage.getItem('userID') , type: 4 , activityOnModule : 'User', activityOnId: data.userId})
            dispatch({
                type: DELETE_USER,
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

export const activity = async(body) => {
    
    let url = `${ENV.url}activity/create`;
   await axios({
        method: 'POST',
        url , 
        data:body,
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
    }).then(data => {
        if (data.data.success) {
            
            // toast.success(data.data.message)
        } else {
            toast.error(data.data.message)
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
    }) 
}

//userRefundData

export const getUserRefund = (qs ,Id , body , callback ) => dispatch => {
    toast.dismiss()
    dispatch(emptyError());
    let url = `${ENV.url}user/get-claimed-refunds/${Id}`;
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
    }).then(res => res.json()).then( data => {
        if(data.status){
            
            callback(data.data)
        }
        else{
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
    })    
}