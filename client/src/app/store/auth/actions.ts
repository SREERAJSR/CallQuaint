import { createAction, props } from "@ngrx/store";
import { UserState } from "../state.model";
import { SocialUser } from "@abacritt/angularx-social-login";


export const loginAction = createAction('[userLogin] click', props<{ email:string,password:string}>())
export const loginSuccess = createAction('[userLogin] user sucessfully login', props<{ loginSuccess: string, user: UserState,userLoggedIn:boolean}>())
export const loginFail = createAction('[userLogin] user login failed', props<{ loginError: string, userLoggedIn: boolean }>())


export const googleLoginAction = createAction('[Google login] click googleAuth button',props<{user:SocialUser}>())
export const googleLoginSucess = createAction('[Google Login] user sucessfully login', props<{user: UserState ,loginSuccess:string}>())
export const googleLoginFail = createAction('[Google Login] user login failed', props<{ loginError: string }>())
