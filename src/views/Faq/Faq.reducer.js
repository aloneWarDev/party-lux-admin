import { BEFORE_CATEGORY, GET_CATEGORIES, UPSERT_CATEGORY, DELETE_CATEGORY, GET_FAQS, BEFORE_FAQ, DELETE_FAQ, CREATE_FAQ, GET_FAQ, EDIT_FAQ } from '../../redux/types';

const initialState = {
    faqs: null,
    getFaqsAuth: false,
    faq: null,
    categories : null , 
    getCategoriesAuth : false,
    category : null ,
    delCategoryAuth: false , 
    upsertCategoryAuth: false ,
    delFaqAuth: false,
    createAuth: false,
    getFaqAuth: false,
    editFaqAuth: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_FAQ:
            return {
                ...state,
                faq: action.payload.faq,
                getFaqAuth: true
            }
        case CREATE_FAQ:{
            
            return {
                ...state,
                createAuth: true
            }
        }
        case GET_FAQS:
            return {
                ...state,
                faqs: action.payload,
                getFaqsAuth: true
            }
        case EDIT_FAQ:
            return {
                ...state,
                faq: action.payload,
                editFaqAuth: true
            }
        case DELETE_FAQ:
            return {
                ...state,
                faq: action.payload,
                delFaqAuth: true
            }

        case GET_CATEGORIES:
            return{
                ...state ,
                categories : action.payload ,
                getCategoriesAuth : true,
            }
        case UPSERT_CATEGORY:
            return{
                ...state , 
                category: action.payload,
                upsertCategoryAuth: true,
            }
        case DELETE_CATEGORY:
            return{
                ...state , 
                category : action.payload , 
                delCategoryAuth : true
            }
        case BEFORE_CATEGORY:
            return{
                ...state , 
                upsertCategoryAuth: false ,
                category: null ,
                categories : null ,
                getCategoriesAuth : false ,
                delCategoryAuth : false , 
            }
        case BEFORE_FAQ:
            return {
                ...state,
                faqs: null,
                getFaqsAuth: false,
                faq: null,
                delFaqAuth: false,
                createAuth: false,
                getFaqAuth: false,
                editFaqAuth: false
            }
        default:
            return {
                ...state
            }
    }
}