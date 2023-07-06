// import { UserTypes } from "@/redux/action-types/user";
// import { ClearTypes } from "@/redux/action-types";
// import { UserAction } from "@/redux/actions/user";
// import { User as UserType } from "@/redux/types/userType";
// import _ from "lodash";

// interface UserState {
//     loading: boolean;
//     error: boolean;
//     me: UserType | null;
// }

// const initialState: UserState = {
//     loading: false,
//     error: false,
//     me: null,
// };

// const UserReducer = (
//     state: UserState = initialState,
//     action: UserAction
// ): UserState => {
//     switch (action.type) {
//         case UserTypes.USER_UPDATE_LOADING:
//         case UserTypes.AVATAR_UPDATE_LOADING:
//         case UserTypes.ME_LOADING:
//             return {
//                 ...state,
//                 loading: true,
//             };
        
//         case UserTypes.AVATAR_UPDATE_SUCCESS:
//             if (!_.isNull(state.me)) {
//                 return {
//                     ...state,

//                     me: {
//                         ...state.me,
//                         avatar: action.payload.avatar,
//                     },
//                     loading: false,
//                 };
//             }
//         case UserTypes.USER_UPDATE_SUCCESS:
//         case UserTypes.ME_SUCCESS:
//             return {
//                 ...state,
//                 loading: false,
//                 me: action.payload,
//             };
//         case UserTypes.USER_UPDATE_ERROR:
//         case UserTypes.AVATAR_UPDATE_ERROR:
//         case UserTypes.ME_ERROR:
//             return {
//                 ...state,
//                 loading: false,
//                 error: action.payload,
//             };
//         case ClearTypes.CLEAR_ME:
//             return {
//                 ...state,
//                 loading: false,
//                 error: null,
//             };
//         default:
//             return state;
//     }
// };

// export default UserReducer;
