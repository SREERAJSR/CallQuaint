import { createReducer, on } from "@ngrx/store";
import { googleLoginAction, googleLoginFail, googleLoginSucess, loginAction, loginFail, loginSuccess } from "./actions";
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
    })
)