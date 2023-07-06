import { ActionType } from "@/redux/action-types";
import {
    REGISTER_MUTATION,
    LOGIN_MUTATION,
    LOGOUT_MUTATION,
    VERIFY_EMAIL_MUTATION,
    ME_QUERY,
    UPDATE_USER_MUTATION,
    UPDATE_PASSWORD,
    AVATAR_MUTATION,
} from "@/redux/mutations/AuthMutations";
import { client as ApolloClient } from "@/app";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { AuthAction } from "@/redux/actions";
import { AuthPayload, ValidationErrors } from "../types/userType";

interface RegisterData {
    name: String;
    email: String;
    password: String;
}

interface LoginData {
    email: String;
    password: String;
}

interface VerifyEmailData {
    email: String;
    token: String;
}

interface UpdatePassword {
    current_password: string;
    password: string;
    password_confirmation: string;
}
export const registerAction =
    (
        registerData: RegisterData
    ): ThunkAction<Promise<void>, {}, {}, AuthAction> =>
    async (dispatch: ThunkDispatch<{}, {}, AuthAction>) => {
        dispatch({
            type: ActionType.REGISTER_LOADING,
        });

        const { data } = await ApolloClient.mutate({
            mutation: REGISTER_MUTATION,
            variables: registerData,
        });
        const { register }: { register: AuthPayload } = data;
        if (
            register.status === "FAILED" ||
            register.status === "VALIDATION_ERROR"
        ) {
            dispatch({
                type: ActionType.REGISTER_ERROR,
                payload: register,
            });
            return;
        }
        dispatch({
            type: ActionType.REGISTER_SUCCESS,
            payload: register,
        });
    };

export const loginAction =
    (loginData: LoginData): ThunkAction<Promise<void>, {}, {}, AuthAction> =>
    async (dispatch: ThunkDispatch<{}, {}, AuthAction>) => {
        dispatch({
            type: ActionType.LOGIN_LOADING,
        });

        const { data } = await ApolloClient.mutate({
            mutation: LOGIN_MUTATION,
            variables: loginData,
        });
        const { login }: { login: AuthPayload } = data;
        if (login.status === "FAILED" || login.status === "VALIDATION_ERROR") {
            dispatch({
                type: ActionType.LOGIN_ERROR,
                payload: login,
            });
            return;
        }
        dispatch({
            type: ActionType.LOGIN_SUCCESS,
            payload: login,
        });
    };

export const logoutAction =
    (): ThunkAction<Promise<void>, {}, {}, AuthAction> =>
    async (dispatch: ThunkDispatch<{}, {}, AuthAction>) => {
        dispatch({
            type: ActionType.LOGOUT_LOADING,
        });

        try {
            const { data } = await ApolloClient.mutate({
                mutation: LOGOUT_MUTATION,
            });
            const { logout }: { logout: AuthPayload } = data;

            dispatch({
                type: ActionType.LOGOUT_SUCCESS,
                payload: logout,
            });
        } catch (error) {
            console.log(error);
        }
    };

export const verifyEmailAction =
    (
        verifyData: VerifyEmailData
    ): ThunkAction<Promise<void>, {}, {}, AuthAction> =>
    async (dispatch: ThunkDispatch<{}, {}, AuthAction>) => {
        dispatch({
            type: ActionType.VERIFY_EMAIL_LOADING,
        });

        const { data } = await ApolloClient.mutate({
            mutation: VERIFY_EMAIL_MUTATION,
            variables: verifyData,
        });
        const { verifyEmail }: { verifyEmail: AuthPayload } = data;
        if (verifyEmail.status === "FAILED") {
            dispatch({
                type: ActionType.VERIFY_EMAIL_ERROR,
                payload: verifyEmail,
            });
            return;
        }
        dispatch({
            type: ActionType.VERIFY_EMAIL_SUCCESS,
            payload: verifyEmail,
        });
    };

export const getMeAction =
    (): ThunkAction<Promise<void>, {}, {}, AuthAction> =>
    async (dispatch: ThunkDispatch<{}, {}, AuthAction>) => {
        dispatch({
            type: ActionType.ME_LOADING,
        });

        try {
            const {
                data: { me },
            } = await ApolloClient.query({
                query: ME_QUERY,
            });
            dispatch({
                type: ActionType.ME_SUCCESS,
                payload: me,
            });
        } catch (error) {
            dispatch({
                type: ActionType.ME_ERROR,
            });
        }
    };

export const updateUserAction =
    (updatData: {
        name?: string;
        email?: string;
    }): ThunkAction<Promise<void>, {}, {}, AuthAction> =>
    async (dispatch: ThunkDispatch<{}, {}, AuthAction>) => {
        dispatch({
            type: ActionType.USER_UPDATE_LOADING,
        });

        const { data } = await ApolloClient.mutate({
            mutation: UPDATE_USER_MUTATION,
            variables: updatData,
        });
        const { updateUser }: { updateUser: AuthPayload } = data;
        if (
            updateUser.status === "FAILED" ||
            updateUser.status === "VALIDATION_ERROR"
        ) {
            dispatch({
                type: ActionType.USER_UPDATE_ERROR,
                payload: updateUser,
            });
            return;
        }
        dispatch({
            type: ActionType.USER_UPDATE_SUCCESS,
            payload: updateUser,
        });
    };

export const updatePasswordAction =
    (
        updatePasswordData: UpdatePassword
    ): ThunkAction<Promise<void>, {}, {}, AuthAction> =>
    async (dispatch: ThunkDispatch<{}, {}, AuthAction>) => {
        dispatch({
            type: ActionType.PASSWORD_UPDATE_LOADING,
        });

        const { data } = await ApolloClient.mutate({
            mutation: UPDATE_PASSWORD,
            variables: updatePasswordData,
        });
        const { updatePassword }: { updatePassword: AuthPayload } = data;
        if (
            updatePassword.status === "FAILED" ||
            updatePassword.status === "VALIDATION_ERROR"
        ) {
            dispatch({
                type: ActionType.PASSWORD_UPDATE_ERROR,
                payload: updatePassword,
            });
            return;
        }
        dispatch({
            type: ActionType.PASSWORD_UPDATE_SUCCESS,
            payload: updatePassword,
        });
    };

export const updateAvatarAction =
    ({
        file,
    }: {
        file: File;
    }): ThunkAction<Promise<void>, {}, {}, AuthAction> =>
    async (dispatch: ThunkDispatch<{}, {}, AuthAction>) => {
        dispatch({
            type: ActionType.AVATAR_UPDATE_LOADING,
        });

        const { data } = await ApolloClient.mutate({
            mutation: AVATAR_MUTATION,
            variables: { file },
        });
        const { uploadAvatar }: { uploadAvatar: AuthPayload } = data;
        if (uploadAvatar.status === "FAILED") {
            dispatch({
                type: ActionType.AVATAR_UPDATE_ERROR,
                payload: uploadAvatar,
            });
            return;
        }
        dispatch({
            type: ActionType.AVATAR_UPDATE_SUCCESS,
            payload: uploadAvatar,
        });
    };
