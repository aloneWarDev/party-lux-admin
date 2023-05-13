import { toast } from "react-toastify";
import { GET_ERRORS, ADD_THEME , BEFORE_THEME , GET_THEMES , EDIT_THEME , GET_THEME , DELETE_THEME,  GET_GAME_THEME, GET_GAME_THEMES , EDIT_GAME_THEME , DELETE_GAME_THEME } from "redux/types";
import { emptyError } from "redux/shared/error/error.action";
import { ENV } from "config/config";
import { activity } from "views/UserManagement/UserManagement.actions";

export const beforeTheme = () =>{
    return {
        type : BEFORE_THEME
    }
}
export const getThemes = (qs = '', body ={} , toastCheck = true , search) => dispatch => {
    
    dispatch(emptyError());
    if(toastCheck){
        toast.dismiss()
    }
    let url = `${ENV.url}theme/`;
    if (qs)
        url += `?${qs}`

    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body:JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            

            //search
            if(search){
                activity({activityBy: localStorage.getItem('userID') , type: 5 , activityOnModule : 'Theme', activityOnId: null})
            } 
            dispatch({
                type: GET_THEMES,
                payload: data
            })
        } else {
            // if (!qs)
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
export const createTheme = (body)=> dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    const url = `${ENV.url}theme/create`
    fetch(url , {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('admin-accessToken'),
            'user-platform' : 2
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then( data =>{
        if(data.success){
            toast.success(data.message)
            // 
            activity({activityBy: localStorage.getItem('userID') , type: 2 , activityOnModule : 'Theme', activityOnId: data?.data?._id  ? data?.data?._id : null})
            dispatch({
                type: ADD_THEME ,
                payload: data
            })
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
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })

}

export const updateTheme = (themeId , body ={}) => dispatch => {
    
    toast.dismiss()
    dispatch(emptyError());
    const url = `${ENV.url}theme/edit/${themeId}`;

    fetch(url, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('admin-accessToken'),
            'user-platform' : 2

        },
        body:JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            
            //updateActivity
            activity({activityBy: localStorage.getItem('userID') , type: 3 , activityOnModule : 'Theme', activityOnId: data?.data?._id})
            dispatch({
                type: EDIT_THEME,
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

//getTheme
export const getTheme = (themeId) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}theme/get-theme`;

    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body:JSON.stringify({'themeId': themeId})
    }).then(res => res.json()).then(data => {
        if (data.success) {
            // toast.success(data.message)
            dispatch({
                type: GET_THEME,
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

export const deleteTheme = (themeId) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}theme/delete`;
    toast.dismiss()
    fetch(url, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body:JSON.stringify({'themeId': themeId})
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            // 
            activity({activityBy: localStorage.getItem('userID') , type: 4 , activityOnModule : 'Theme', activityOnId: themeId ? themeId : null})
            dispatch({
                type: DELETE_THEME,
                payload: {themeId:themeId}
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

//list -> getGameThemes
export const getGameThemes = (qs='' , body) => dispatch => {
    
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}theme/get-game-themes`;
    if (qs)
        url += `?${qs}`

    fetch(url , {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body : JSON.stringify(body)
    }).then(res => res.json()).then( data => {
        if (data.success) {
            
            toast.success(data.message)
            dispatch({
                type: GET_GAME_THEMES,
                payload: data.data
            })
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data.data
            })
        }
    }).catch( error =>{
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

//getGameTheme
export const gameThemeDetails = (themeId) => dispatch =>{
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}theme/get-theme-details`;

    fetch( url , {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body : JSON.stringify({themeId : themeId})
    })
    .then(res => res.json()).then(data => {
        if (data.success) {
            
            toast.success(data.message)
            dispatch({
                type: GET_GAME_THEME,
                payload: data.data
            })
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data.data
            })
        } 
    }).catch( error =>{
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
//
export const updateGameTheme = (themeId , body ={}) => dispatch => {
    
    toast.dismiss()
    dispatch(emptyError());
    const url = `${ENV.url}theme/edit-game-theme/${themeId}`;

    fetch(url, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('admin-accessToken'),
            'user-platform' : 2

        },
        body:JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            
            //updateActivity
            // activity({activityBy: localStorage.getItem('userID') , type: 3 , activityOnModule : 'Theme', activityOnId: data?.data?._id})
            dispatch({
                type: EDIT_GAME_THEME,
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

export const deleteGameTheme = (themeId) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    const url = `${ENV.url}theme/delete-game-theme`
    fetch(url, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body:JSON.stringify({'themeId': themeId})
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            // 
            // activity({activityBy: localStorage.getItem('userID') , type: 4 , activityOnModule : 'Theme', activityOnId: themeId ? themeId : null})
            dispatch({
                type: DELETE_GAME_THEME,
                payload: {themeId:themeId}
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