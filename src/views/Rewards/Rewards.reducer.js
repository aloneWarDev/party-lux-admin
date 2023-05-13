import { CREATE_REWARD ,GET_REWARD , EDIT_REWARD , DELETE_REWARD , BEFORE_REWARD  , GET_REWARDS } from "redux/types"

const initialState ={
    rewards: null , 
    getRewardsAuth: false ,
    reward: null,
    getRewardAuth: false,
    delRewardAuth: false ,
    editRewardAuth: false,
    createAuth: false

}
export default function(state  = initialState , action){
    switch(action.type){
        case GET_REWARD:
            return {
                ...state,
                reward: action.payload,
                getRewardAuth: true
            }
        case CREATE_REWARD:
            return {
                ...state,
                createAuth: true
            }
        case GET_REWARDS:
            return {
                ...state,
                rewards: action.payload,
                getRewardsAuth: true
            }
        case EDIT_REWARD:
            return {
                ...state,
                reward: action.payload,
                editRewardAuth: true
            }
        case DELETE_REWARD:
            return {
                ...state,
                reward: action.payload,
                delRewardAuth: true
            }
        case BEFORE_REWARD:
            return {
                ...state,
                rewards: null , 
                getRewardsAuth: false ,
                reward: null,
                getRewardAuth: false,
                delRewardAuth: false ,
                editRewardAuth: false,
                createAuth: false
            }
        default:
            return {
                ...state
            }
    }
}