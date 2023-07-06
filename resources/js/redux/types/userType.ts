export type Statuses =
    | "LOGIN"
    | "LOGOUT"
    | "FAILED"
    | "SUCCESS"
    | "NOT_AUTHORIZED"
    | "EMAIL_VERIFIED"
    | "AVATAR_CHANGED"
    | "PASSWORD_CHANGED"
    | "VALIDATION_ERROR"
    | "MUST_VERIFY_EMAIL";

export interface ValidationErrors {
    [key: string]: string[];
}

export interface AuthPayload {
    token?: string;
    status: Statuses;
    errors?: ValidationErrors;
    user: User | null;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at?: Date;
    created_at: Date;
    updated_at: Date;
}
