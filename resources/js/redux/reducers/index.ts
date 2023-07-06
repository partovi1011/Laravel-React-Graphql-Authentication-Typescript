import { combineReducers } from "redux";
import AuthReducer from "@/redux/reducers/authReducer"

const reducers = combineReducers({
    auth: AuthReducer,
})


export default reducers;
export type RootState = ReturnType<typeof reducers>;