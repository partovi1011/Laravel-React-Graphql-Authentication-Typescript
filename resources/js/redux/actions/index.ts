import { ActionType } from "@/redux/action-types";
import { ClearTypes } from "@/redux/action-types";
import {
    AuthPayload,
    Statuses,
    ValidationErrors,
} from "@/redux/types/userType";
import { User as UserType } from "@/redux/types/userType";

export interface LoginSuccessAction {
    type: ActionType.LOGIN_SUCCESS;
    payload: AuthPayload;
}

export interface LoginErrorAction {
    type: ActionType.LOGIN_ERROR;
    payload: AuthPayload;
}

export interface LoginLoadingAction {
    type: ActionType.LOGIN_LOADING;
}

export interface RegisterSuccessAction {
    type: ActionType.REGISTER_SUCCESS;
    payload: AuthPayload;
}
export interface RegisterErrorAction {
    type: ActionType.REGISTER_ERROR;
    payload: AuthPayload;
}

export interface RegisterLoadingAction {
    type: ActionType.REGISTER_LOADING;
}

export interface LogoutSuccessAction {
    type: ActionType.LOGOUT_SUCCESS;
    payload: AuthPayload;
}
export interface LogoutErrorAction {
    type: ActionType.LOGOUT_ERROR;
    payload: AuthPayload
}

export interface LogoutLoadingAction {
    type: ActionType.LOGOUT_LOADING;
}

export interface VerifyEmailSuccessAction {
    type: ActionType.VERIFY_EMAIL_SUCCESS;
    payload: AuthPayload;
}

export interface VerifyEmailErrorAction {
    type: ActionType.VERIFY_EMAIL_ERROR;
    payload: AuthPayload;
}

export interface VerifyEmailLoadingAction {
    type: ActionType.VERIFY_EMAIL_LOADING;
}

export interface MeActionLoading {
    type: ActionType.ME_LOADING;
}

export interface MeActionSuccess {
    type: ActionType.ME_SUCCESS;
    payload: UserType;
}

export interface MeActionError {
    type: ActionType.ME_ERROR;
}

export interface UpdateUserActionLoading {
    type: ActionType.USER_UPDATE_LOADING;
}

export interface UpdateUserActionSuccess {
    type: ActionType.USER_UPDATE_SUCCESS;
    payload: AuthPayload;
}

export interface UpdateUserActionError {
    type: ActionType.USER_UPDATE_ERROR;
    payload: AuthPayload;
}

export interface UpdatePasswordActionLoading {
    type: ActionType.PASSWORD_UPDATE_LOADING;
}

export interface UpdatePasswordActionSuccess {
    type: ActionType.PASSWORD_UPDATE_SUCCESS;
    payload: AuthPayload;
}

export interface UpdatePasswordActionError {
    type: ActionType.PASSWORD_UPDATE_ERROR;
    payload: AuthPayload;
}

export interface UploadAvatarActionLoading {
    type: ActionType.AVATAR_UPDATE_LOADING;
}

export interface UploadAvatarActionSuccess {
    type: ActionType.AVATAR_UPDATE_SUCCESS;
    payload: AuthPayload;
}

export interface UploadAvatarActionError {
    type: ActionType.AVATAR_UPDATE_ERROR;
    payload: AuthPayload;
}

export interface clearAll {
    type: ClearTypes.CLEAR_AUTH;
}

export type AuthAction =
    | LoginSuccessAction
    | LoginErrorAction
    | LoginLoadingAction
    | RegisterSuccessAction
    | RegisterErrorAction
    | RegisterLoadingAction
    | LogoutSuccessAction
    | LogoutErrorAction
    | LogoutLoadingAction
    | VerifyEmailSuccessAction
    | VerifyEmailErrorAction
    | VerifyEmailLoadingAction
    | MeActionLoading
    | MeActionSuccess
    | MeActionError
    | UpdateUserActionLoading
    | UpdateUserActionSuccess
    | UpdateUserActionError
    | UpdatePasswordActionLoading
    | UpdatePasswordActionSuccess
    | UpdatePasswordActionError
    | UploadAvatarActionLoading
    | UploadAvatarActionSuccess
    | UploadAvatarActionError
    | clearAll;
