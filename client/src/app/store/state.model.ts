

export interface UserState {
    avatar:string
    firstname: string
    lastname: string,
    fullname: string,
    email: string,
    gender:string |null
}

export interface AuthState{
    userLoggedIn: boolean,
    user: UserState | null,
    loginSuccess: string | null,
    loginError: string |null
}