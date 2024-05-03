import { Injectable } from "@angular/core";
import { Actions, act, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../../services/auth.service";
import { googleLoginAction, googleLoginFail, googleLoginSucess, loginAction, loginFail, loginSuccess } from "./actions";
import { Observable, catchError, map, of, switchMap, tap } from "rxjs";
import { Store } from "@ngrx/store";
import { InitialState } from "@ngrx/store/src/models";
import { AppState } from "../store";
import { UserState } from "../state.model";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { ApiResponse } from "src/app/types/api.interface";



@Injectable()
export class appEffects {
    constructor(
        private action$: Actions,
        private authService: AuthService,
        private store: Store<AppState>) { }
    
    
    loginUser$ = createEffect(() =>
        this.action$.pipe(
            ofType(loginAction),
            switchMap(({ email, password }) => {
                const payload: Record<string, string> = { email: email, password: password }
                return this.authService.userLogin(payload).pipe(
                    map((response) => {
                        const props = {
                            loginSuccess: response.message,
                            user: {
                                avatar: response.data.user.avatar,
                                firstname: response.data.user.firstname,
                                lastname: response.data.user.lastname,
                                fullname: response.data.user.firstname + '' + response.data.user.lastname,
                                email:response.data.user.email
                            } as UserState,
                            userLoggedIn: true
                        }
                        if (response.statusCode === 200) {
                            console.log(response);
                            this.authService.setAccessToken(response.data?.accessToken as string)
                            this.authService.setRefreshToken(response.data?.refreshToken as string)
                            return loginSuccess(props)
                        }
                        throw new Error("Something went wrong")
                    }),
                    catchError((error)=> {
                        const props = {
                            userLoggedIn: false,
                            loginError:error.message
                        }
                        return of(loginFail(props))
                    })
                )
            })
        )
    )

    googleLoginUser$ = createEffect(() => {
        return this.action$.pipe(
            ofType(googleLoginAction),
            switchMap(({ user }) => {
                return this.authService.googleAuthenticaton(user).pipe(
                    tap((response) => {
                        console.log(response);   
                    }),
                    map((response: ApiResponse) => {
                        if (response.statusCode === 200) {
                            this.authService.setAccessToken(response?.data?.accessToken);
                            this.authService.setRefreshToken(response?.data?.refreshToken);
                             const user= {
                                avatar: response.data?.user?.avatar,
                                firstname: response.data?.user?.firstname,
                                lastname: response.data?.user?.lastname,
                                fullname: response?.data?.user?.firstname +' ' + response.data.user.lastname,
                                email:response.data.user.email
                             } as UserState
                            console.log(user)
                        const payload = {
                            user: user,
                            loginSuccess: response.message
                        }
                     return googleLoginSucess(payload)
                        }
                        throw new Error('something went wrong')
                    }),
                    catchError((error: HttpErrorResponse) => {
                        console.log(error);
                        const props = {
                            loginError:error.message
                        }
                        return of(googleLoginFail(props));
                })    
                )
            })
        )
    })
    
}