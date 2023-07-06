import { useEffect } from "react";

import { createSocketConnection } from "@/libs/SocketConnection";

function listen(
    callBack: (payload: any) => void,
    channel: string,
    event: string
) {
    window.Echo.private(channel).listen(event, (payload: any) => {
        console.log(payload);

        callBack(payload);
    });

    // return function cleanUp() {
    //     window.Echo.leaveChannel(`private-${channel}`);
    // };
}

type Options = {
    token: string | null;
    id: string | undefined;
    type: "FOLLOW" | "UNFOLLOW";
    callBack: (payload: any) => void;
};

export const useSocket = ({ token, id, type, callBack }: Options) => {
    if (token && id) {
        createSocketConnection(token);
        switch (type) {
            case "FOLLOW": {
                return listen(callBack, `App.Models.User.${id}`, ".follow");
            }
        }
    }
};
