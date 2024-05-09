import { createReducer, on } from "@ngrx/store";
import {  changeUserStateInRefresh, changeUserStateInRefreshSucess, googleLoginAction, googleLoginFail, googleLoginSucess, loginAction, loginFail, loginSuccess, logout, logoutFailed, logoutSuccess, setGender, setGenderFail, setGenderSucess } from "./actions";
import { AuthState } from "../state.model";

export const initialState:AuthState  = {
    userLoggedIn: false,
    user: null,
    loginSuccess: null,
    loginError: null,
}

export const authReducer = createReducer(initialState,
    on(loginAction, (state, action) => {
        return {
            ...state,
        }
    }),
    on(loginSuccess, (state, action) => {
        return {
            ...state,
            userLoggedIn: action.userLoggedIn,
            user: action.user,
            loginSuccess: action.loginSuccess,
            loginError: null
        }
    }
    ),
    on(loginFail, (state, action) => {
        return {
            ...state,
            userLoggedIn: action.userLoggedIn,
            loginError: action.loginError,
            user: null,
            loginSuccess:null
        }
    }),
    on(googleLoginAction, (state, action) => {
        return {
            ...state,
        }
    }),
    on(googleLoginSucess, (state, action) => {
        return {
            ...state,
            userLoggedIn: true,
            user: action.user,
            loginSuccess: action.loginSuccess,
            loginError:null
        }
    }),
    on(googleLoginFail, (state, action) => {
        return {
            ...state,
            user: null,
            userLoggedIn: false,
            loginError:action.loginError
        }
    }),
    on(setGender, (state, action) => {
        return {
            ...state,
        }
    }),   on(setGenderSucess, (state, action) => {
        return {
            ...state,
            user: action.user
        }
    }),
       on(setGenderFail, (state) => {
        return {
            ...state,
        }
    }),
    on(logout, (state) => {
        return {
            ...state,
        }
    }),
    on(logoutSuccess, state => ({ ...state, userLoggedIn: false, loginSuccess: null,user:null })),
    on(logoutFailed, state => ({ ...state })),
    on(changeUserStateInRefresh, (state, action) => {
        return {
            ...state,
            userLoggedIn:true
       }
    }),
    on(changeUserStateInRefreshSucess, (state, action) => {
        return {
            ...state,
            user: action.user,
            userLoggedIn: true
        }
    })
)