import { toast } from 'react-toastify';
import { GET_ERRORS, BEFORE_ADMIN, LOGIN_ADMIN, GET_ADMIN, ADD_ADMIN,GET_ADMINS, DELETE_ADMIN, UPDATE_ADMIN, UPDATE_PASSWORD, FORGOT_PASSWORD, RESET_PASSWORD, BEFORE_USER_VERIFY, GET_USER_VERIFY } from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';
import { activity } from '../UserManagement/UserManagement.actions'
import axios from 'axios'

export const beforeAdmin = () => {
    return {
        type: BEFORE_ADMIN
    }
}

export const login = (body) => dispatch => {
    toast.dismiss()
    dispatch(emptyError());
    const url = `${ENV.url}auth/signin`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        console.log("data: ",data)
        if (data.status === 200) {
            // toast.success(data.message)
            if(data.data.isVerified){
                console.log("accessToken: ",data.accessToken)
                localStorage.setItem("admin-accessToken", data.data.accessToken);
                
                // activity({activityBy: localStorage.getItem('userID') , type: 1 , activityOnModule : 'login', activityOnId: data.data?._id})
                dispatch({
                    type: LOGIN_ADMIN,
                    payload: data
                })
            }
            else{
                toast.error("You are not active. Kindly contact admin!")
                dispatch({
                    type: GET_ERRORS,
                    payload: data
                })
            }
            
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

export const addStaffAdmin = (body) => dispatch => {
    toast.dismiss()
    dispatch(emptyError());
    // dispatch(setloader());
    fetch(ENV.url + 'staff/create', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            // 'x-access-role': ENV.getRoleId(),
            'x-access-token': localStorage.getItem('admin-accessToken'),
            'user-platform': 2 // 2 = admin
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: ADD_ADMIN,
                payload: data
            });
        } else {
            let toastOptions = {};
            if(data.type && data.type === "ROLE_CHANGED") {
                toastOptions = {
                    toastId : "CHANGE_ROLE_ERROR",
                    autoClose: false
                }
            }
            toast.error(`${data.message}`, toastOptions);
            dispatch(removeloader());
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(errors => {
        dispatch(removeloader());
        dispatch({
            type: GET_ERRORS,
            payload: errors
        })
    })
}

export const deleteAdmin = (adminId) => dispatch => {
    toast.dismiss()
    dispatch(emptyError());
    let url = `${ENV.url}staff/delete/${adminId}`;

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
            dispatch({
                type: DELETE_ADMIN,
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

export const getAdmin = (staffId  , callback) => dispatch => {
    toast.dismiss()
    dispatch(emptyError());
    let url = `${ENV.url}staff/get/${staffId}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'user-platform': 2 // 2 = admin
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            
            toast.success(data.message)
            dispatch({
                type: GET_ADMIN,
                payload: data.admin
            })
            callback(data.admin)

            
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

export const getStaffAdmins = (page = 1, limit = 10, query = "", adminId ="" ,toastCheck =false) => dispatch => {
    if(toastCheck){
        toast.dismiss()
    }
    dispatch(emptyError());
    let url = `staff/list?page=${page}&limit=${limit}&adminId=${adminId}`;

    if (query !== '' && query !== undefined)
        url = `staff/list?page=${page}&limit=${limit}&adminId=${adminId}&query=${query}`;

    fetch(ENV.url + url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            // 'x-access-role': ENV.getRoleId(),
            'x-access-token': localStorage.getItem('admin-accessToken'),
            'user-platform': 2 // 2 = admin
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            if(toastCheck){
                toast.success(data.message)
            }

            // console.log("data.success: ",data.message)
            dispatch({
                type: GET_ADMINS,
                payload: data
            })
        }
        else {
            toast.error(data.message)
            // let toastOptions = {};
            // if(data.type && data.type === "ROLE_CHANGED") {
            //     toastOptions = {
            //         toastId : "CHANGE_ROLE_ERROR",
            //         autoClose: false
            //     }
            // }
            // toast.error(`${data.message}`, toastOptions);
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(errors => {
        dispatch({
            type: GET_ERRORS,
            payload: errors
        })
    })
}

export const updateAdmin = (body , toastCheck=false ,callback='' ) => dispatch => {
    toast.dismiss()
    dispatch(emptyError());
    const url = `${ENV.url}staff/edit`;
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
            // 'x-access-role': ENV.getRoleId(),
            'x-access-token': localStorage.getItem('admin-accessToken'),
            'user-platform': 2 // 2 = admin
        }
    })
    .then(data => {
        if (data.data.success) {
            // if(toastCheck){
                toast.success(data.data.message)
            // }

            dispatch({
                type: UPDATE_ADMIN,
                payload: data.data
            })

            if(callback){
                callback(data.data)
            }

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
            if (data.data.message)
                toast.error(data.data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const updatePassword = (body, toastCheck , callback ,  method = 'PUT' ) => dispatch => {
    toast.dismiss()
    dispatch(emptyError());
    const url = `${ENV.url}staff/edit-password`;
    fetch(url, {
        method,
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'user-platform': 2 // 2 = admin
        },
        body
    }).then(res => res.json()).then(data => {
        if (data.success) {
            // if(toastCheck){
                toast.success(data.message)
            // }

            dispatch({
                type: UPDATE_PASSWORD,
                payload: data
            })
            callback(data)
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

export const forgotPassword = (body) => dispatch => {
    toast.dismiss()
    dispatch(emptyError());
    const url = `${ENV.url}staff/forgot-password`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'user-platform': 2 // 2 = admin
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: FORGOT_PASSWORD,
                msg: data.message
            })
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS
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

export const resetPassword = (body, method = 'PUT') => dispatch => {
    toast.dismiss()
    dispatch(emptyError());
    const url = `${ENV.url}staff/reset-password`;
    fetch(url, {
        method,
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'user-platform': 2 // 2 = admin
        },
        body
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: RESET_PASSWORD,
                payload: data.data
            })
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS
        })
    })
};

export const getUserVerify = (body) => dispatch => {
    toast.dismiss()
    dispatch(emptyError());
    const url = `${ENV.url}staff/verify-admin-password`
    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            // 'x-access-role': ENV.getRoleId(),
            'x-access-token': localStorage.getItem('admin-accessToken')
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: GET_USER_VERIFY,
                payload: data
            })
        }
        else {
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(errors => {
        dispatch({
            type: GET_ERRORS,
            payload: errors
        })
    })
};

export const beforeVerify = () => {
    return {
        type: BEFORE_USER_VERIFY
    }
};