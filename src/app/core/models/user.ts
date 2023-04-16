export class User {
    user: LoginUser;
    token: string;
    expires: string;
}

export class LoginUser {
    id: number;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
}
