import { GET_CONTENT_PAGE, GET_CONTENT_PAGES, EDIT_CONTENT_PAGE, DELETE_CONTENT_PAGE, ADD_CONTENT_PAGE, BEFORE_CONTENT, GET_ERRORS } from '../../redux/types'
import { toast } from 'react-toastify';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';
import { activity } from 'views/UserManagement/UserManagement.actions';
import axios from 'axios'
export const beforeContent = () => {
    return {
        type: BEFORE_CONTENT
    }
}
//getContentPages
export const getContentPages = (qs = '', body = {}, search) => dispatch => {
    if(!localStorage.getItem('toastCheck')){
        toast.dismiss()
    }

    dispatch(emptyError());
    let url = `${ENV.url}content/list`;
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

            if(localStorage.getItem('toastCheck')){
                localStorage.removeItem('toastCheck')
            }
 

            if (search) {
                activity({ activityBy: localStorage.getItem('userID'), type: 5, activityOnModule: 'cms', activityOnId: null })
            }
            dispatch({
                type: GET_CONTENT_PAGES,
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

export const updateContent = (body) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    const url = `${ENV.url}content/edit`;
    localStorage.setItem('toastCheck', 'true')

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
            'x-access-token': localStorage.getItem('admin-accessToken'),
            'user-platform': 2
        }
    })
        .then(data => {
            if (data.data.success) {
                toast.success(data.data.message)
                // 
                activity({ activityBy: localStorage.getItem('userID'), type: 3, activityOnModule: 'cms', activityOnId: data.data.content._id ? data.data.content._id : null })
                dispatch({
                    type: EDIT_CONTENT_PAGE,
                    payload: data.data
                })
            }
            else {
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
};

export const deleteContent = (contentId) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}content/delete/${contentId}`;

    fetch(url, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('admin-accessToken'),
            'user-platform': 2
        }
    }).then(res => res.json())
        .then(data => {
            if (data.success) {
                toast.success(data.message)
                // 
                activity({ activityBy: localStorage.getItem('userID'), type: 4, activityOnModule: 'cms', activityOnId: contentId ? contentId : null })
                dispatch({
                    type: DELETE_CONTENT_PAGE,
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

export const addContent = (body) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    const url = `${ENV.url}content/create`;
    localStorage.setItem('toastCheck', 'true')
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
            'x-access-token': localStorage.getItem('admin-accessToken'),
            'user-platform': 2
        }
    })
        .then(data => {
            if (data.data.success) {
                toast.success(data.data.message)
                // 
                activity({ activityBy: localStorage.getItem('userID'), type: 2, activityOnModule: 'cms', activityOnId: data.data.content?._id ? data.data.content?._id : null })
                dispatch({
                    type: ADD_CONTENT_PAGE,
                    payload: data.data
                })
            }
            else {
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
};




// export const updateLearning = (body,Id) => dispatch => {
//     dispatch(emptyError());
//     const url = `${ENV.url}learning/edit/${Id}`;
//     let data = new FormData();
//     for (var v in body) {
//         data.append(`${v}`,body[v]);
//     }

//     axios({
//         method: 'PUT',
//         url:url,
//         data:data,
//         headers: {
//             'Content-Type': 'multipart/form-data',
//             'Authorization': ENV.Authorization,
//             'x-auth-token': ENV.x_auth_token,
//         }
//     })
//     .then(data => {

//         if (data.data.success) {
//             toast.success(data.data.message)
//             
//             activity({activityBy: localStorage.getItem('userID') , type: 3 , activityOnModule : 'LearningCenter', activityOnId: data.data.learningCenter?._id})
//             dispatch({
//                 type: EDIT_LEARNING,
//                 payload: data.data?.learningCenter
//             })
//         } 
//         else {
//             toast.error(data.data.message)
//             dispatch({
//                 type: GET_ERRORS,
//                 payload: data.data.data
//             })
//         }

//     }).catch(error => {
//         if (error.response && error.response.data) {
//             const { data } = error.response
//             if (data.message)
//                 toast.error(data.message)
//         }
//         dispatch({
//             type: GET_ERRORS,
//             payload: error
//         })
//     })
// };

export const getContent = (contentId) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}content/get/${contentId}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('admin-accessToken'),
            'user-platform': 2

        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            // toast.success(data.message) // it is temprarily commented
            dispatch({
                type: GET_CONTENT_PAGE,
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