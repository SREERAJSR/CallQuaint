import { createSelector } from "@ngrx/store";
import { AppState } from "../store";
import { UserState } from "../state.model";


export const loginSuccessState = (state: AppState) => state.auth.loginSuccess;
export const selectLoginSucessMessage = createSelector(
    loginSuccessState,(state)=> state 
)

export const loginFailState = (state: AppState) => state.auth.loginError
export const selectLoginErrorMessage = createSelector(
    loginFailState,
    (state)=> state
)

const userState = (state: AppState) => state.auth.user
export const selectUserState = createSelector(userState, (user: UserState | null) => {
     return user
})
 
const userLoggedInState = (state: AppState) => state.auth.userLoggedIn

export const selectUserLoginState =createSelector(userLoggedInState,(status)=>status)