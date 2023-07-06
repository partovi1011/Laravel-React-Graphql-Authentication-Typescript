import { ActionType, ClearTypes } from "@/redux/action-types";
import { AuthAction } from "@/redux/actions";
import _ from "lodash";
import { Statuses, User, ValidationErrors } from "../types/userType";

interface AuthState {
    loading: boolean;
    error: ValidationErrors | undefined;
    status: Statuses | "";
    userLoggedIn: boolean;
    must_verify_email: boolean;
    user: User | null;
}

const initialState: AuthState = {
    loading: false,
    error: undefined,
    status: "",
    userLoggedIn: false,
    must_verify_email: false,
    user: null,
};

const localToken = localStorage.getItem("token");

if (localToken) {
    initialState.userLoggedIn = true;
}
// if (localToken) {
//     const decodedToken = jwtDecode<JwtPayload>(localToken);
//     if (decodedToken?.exp) {
//         if (decodedToken.exp * 1000 < Date.now()) {
//             localStorage.removeItem("token");
//         } else {
//             initialState.userLoggedIn = true;
//         }
//     }
// }

const reducer = (
    state: AuthState = initialState,
    action: AuthAction
): AuthState => {
    switch (action.type) {
        case ActionType.ME_LOADING:
        case ActionType.LOGIN_LOADING:
        case ActionType.REGISTER_LOADING:
        case ActionType.LOGOUT_LOADING:
        case ActionType.VERIFY_EMAIL_LOADING:
        case ActionType.USER_UPDATE_LOADING:
        case ActionType.PASSWORD_UPDATE_LOADING:
        case ActionType.AVATAR_UPDATE_LOADING:
            return {
                ...state,
                loading: true,
            };
        case ActionType.AVATAR_UPDATE_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                loading: false,
                status: action.payload.status,
            };
        case ActionType.ME_SUCCESS:
            return {
                ...state,
                user: action.payload,
                loading: false,
                status: "SUCCESS",
            };

        case ActionType.PASSWORD_UPDATE_SUCCESS:
            return {
                ...state,
                loading: false,
                status: action.payload.status,
            };

        case ActionType.VERIFY_EMAIL_SUCCESS:
        case ActionType.USER_UPDATE_SUCCESS:
        case ActionType.LOGIN_SUCCESS:
        case ActionType.REGISTER_SUCCESS:
            if (
                action.payload.status === "SUCCESS" ||
                action.payload.status === "LOGIN" ||
                action.payload.status === "EMAIL_VERIFIED"
            ) {
                if (!_.isUndefined(action.payload.token)) {
                    localStorage.setItem("token", action.payload.token);
                }

                return {
                    ...state,
                    loading: false,
                    userLoggedIn: true,
                    user: action.payload.user,
                    status: action.payload.status,
                };
            } else if (action.payload.status === "MUST_VERIFY_EMAIL") {
                return {
                    ...state,
                    loading: false,
                    must_verify_email: true,
                    status: action.payload.status,
                };
            }

        case ActionType.LOGOUT_SUCCESS:
            localStorage.removeItem("token");

            return {
                ...state,
                userLoggedIn: false,
                error: undefined,
                loading: false,
                user: null,
                status: action.payload.status,
            };

        case ActionType.ME_ERROR:
            return {
                ...state,
                loading: false,
                status: "FAILED",
            };
        case ActionType.AVATAR_UPDATE_ERROR:
        case ActionType.LOGIN_ERROR:
        case ActionType.REGISTER_ERROR:
        case ActionType.VERIFY_EMAIL_ERROR:
        case ActionType.USER_UPDATE_ERROR:
        case ActionType.PASSWORD_UPDATE_ERROR:
        case ActionType.LOGOUT_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload.errors,
                status: action.payload.status,
            };

        case ClearTypes.CLEAR_AUTH:
            return {
                ...state,
                loading: false,
                error: undefined,
                status: "",
                userLoggedIn: false,
                must_verify_email: false,
            };

        default:
            return state;
    }
};

export default reducer;
