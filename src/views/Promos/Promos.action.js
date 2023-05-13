import { toast } from 'react-toastify';
import { BEFORE_PROMO, CREATE_PROMO, DELETE_PROMO, EDIT_PROMO, GET_ERRORS, GET_PROMO, GET_PROMOS } from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from '../../config/config';
import axios from 'axios';
import { activity } from 'views/UserManagement/UserManagement.actions';


export const beforePromo = () => {
    return {
        type: BEFORE_PROMO
    }
}

export const getPromos = (qs = '', body ={} , search) => dispatch => {
    
    if(!qs){
        toast.dismiss()
    }
    dispatch(emptyError());
    let url = `${ENV.url}promos/list`;
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
                activity({activityBy: localStorage.getItem('userID') , type: 5 , activityOnModule : 'Promos', activityOnId: null})
            }

            dispatch({
                type: GET_PROMOS,
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



export const createPromo = (body,callback=null) => dispatch => {
    // 
    dispatch(emptyError());
    toast.dismiss()
    const url = `${ENV.url}promos/create`;

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
            
            activity({activityBy: localStorage.getItem('userID') , type: 2 , activityOnModule : 'Promos', activityOnId: data.data.data?._id })
            dispatch({
                type: CREATE_PROMO,
                payload: data.data.data
            })
        
        } 
        else {
            toast.error(data.data.message)
            callback()
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

export const updatePromo = (promoId , body,callback) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    const url = `${ENV.url}promos/edit/${promoId}`;
    
    
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
            
            activity({activityBy: localStorage.getItem('userID') , type: 3 , activityOnModule : 'Promos', activityOnId: data.data.data?._id })
            dispatch({
                type: EDIT_PROMO,
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

export const deletePromo = (promoId) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}promos/delete/${promoId}`;

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
            
            activity({activityBy: localStorage.getItem('userID') , type: 3 , activityOnModule : 'Promos', activityOnId: data?.promoId })
            dispatch({
                type: DELETE_PROMO,
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



export const getPromo = (promoId) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}promos/get/${promoId}`;

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
                type: GET_PROMO,
                payload: data.data
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