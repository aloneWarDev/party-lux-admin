import { toast } from 'react-toastify';
// import { GET_ERRORS,  GET_FAQS, BEFORE_FAQ, DELETE_FAQ, CREATE_FAQ, GET_FAQ, EDIT_FAQ} from '../../redux/types';
import { GET_ERRORS, GET_LEARNINGS, BEFORE_LEARNING, DELETE_LEARNING, CREATE_LEARNING, GET_LEARNING, EDIT_LEARNING } from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from '../../config/config';
import axios from 'axios'
import { activity } from 'views/UserManagement/UserManagement.actions';

export const beforeLearning = () => {
    return {
        type: BEFORE_LEARNING
    }
}


export const getLearnings = (qs = '', body ={} , toastCheck=false , search) => dispatch => {
    dispatch(emptyError());
    if(toastCheck){
        toast.dismiss()
    }

    let url = `${ENV.url}learning/list`;
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
            // if (!qs)
            //search
            if(search){
                activity({activityBy: localStorage.getItem('userID') , type: 5 , activityOnModule : 'LearningCenter', activityOnId: null})
            }
            
            dispatch({
                type: GET_LEARNINGS,
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




export const updateLearning = (body,Id) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    const url = `${ENV.url}learning/edit/${Id}`;
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
            
            activity({activityBy: localStorage.getItem('userID') , type: 3 , activityOnModule : 'LearningCenter', activityOnId: data.data.learningCenter?._id})
            dispatch({
                type: EDIT_LEARNING,
                payload: data.data?.learningCenter
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
export const deleteLearning = (learningId) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}learning/delete/${learningId}`;

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
            
            activity({activityBy: localStorage.getItem('userID') , type: 4 , activityOnModule : 'LearningCenter', activityOnId: data?.learningId})
            dispatch({
                type: DELETE_LEARNING,
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


export const addLearning = (body) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    const url = `${ENV.url}learning/create`;
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
            
            activity({activityBy: localStorage.getItem('userID') , type: 2 , activityOnModule : 'LearningCenter', activityOnId: data.data?.learningCenter._id })
            dispatch({
                type: CREATE_LEARNING,
                payload: data.data?.learningCenter
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
export const getLearning = (learningId) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}learning/get/${learningId}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            // toast.success(data.message)
            dispatch({
                type: GET_LEARNING,
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