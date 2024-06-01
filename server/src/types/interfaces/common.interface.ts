export interface Attachment {
    url: string
    localPath:string
}


interface Avatar {
    url: string;
    localPath: string;
    _id: string;
}

export interface Participant {
    _id: string;
    avatar: Avatar;
    username: string;
    email: string;
    role: string;
    loginType: string;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface ChatInterface {
    participants?: Participant[];

}
