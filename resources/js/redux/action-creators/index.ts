export * from "@/redux/action-creators/authActions";

import { ClearTypes } from "@/redux/action-types";
import { ThunkAction, ThunkDispatch } from "redux-thunk";


export const clearAll =
    ({ type }: { type: ClearTypes }): ThunkAction<Promise<void>, {}, {}, any> =>
    async (dispatch: ThunkDispatch<{}, {}, any>) => {
        dispatch({
            type,
        });
    };
