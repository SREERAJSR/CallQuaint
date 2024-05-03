

export interface UserState {
    avatar:string
    firstname: string
    lastname: string,
    fullname: string,
    email: string,
}

export interface AuthState{
    userLoggedIn: boolean,
    user: UserState | null,
    loginSuccess: string | null,
    loginError: string |null
}