import { useEffect } from "react";
import { User } from "@/redux/types/userType";
import { Link, Head, router } from "@inertiajs/react";
import React from "react";
import { useActions } from "@/hooks/use-actions";
import { useToast } from "@/Components/ui/use-toast";
import { ActivityIcon } from "lucide-react";
import { useTypedSelector } from "@/hooks/use-typed-selector";
import _ from "lodash";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";

  
interface PageProps {
    laravelVersion: string;
    phpVersion: string;
    auth: User | null;
    verify_email?: boolean;
    token?: string;
    email?: string;
}

const Welcome: React.FC<PageProps> = ({
    auth,
    laravelVersion,
    phpVersion,
    verify_email,
    token,
    email,
}) => {
    const { getMeAction, logoutAction, verifyEmailAction, clearAll } =
        useActions();
    if (!_.isUndefined(token) && !_.isUndefined(email)) {
        verifyEmailAction({token: token, email: email})
        console.log(token, email);
    }
    const urlParams = new URLSearchParams(window.location.search);
    const tokenQParam = urlParams.get("token");
    const emailQParam = urlParams.get("email");

    const { toast } = useToast();
    const { error, loading, userLoggedIn, user, status } = useTypedSelector(
        (state) => state.auth
    );
    useEffect(() => {
        if (userLoggedIn && _.isNull(user)) {
            getMeAction();
        }
        if (!_.isNull(emailQParam) && !_.isNull(tokenQParam)) {
            verifyEmailAction({ token: tokenQParam, email: emailQParam });
        }
    }, []);

    useEffect(() => {
        // if (error) {
        //     toast({
        //         variant: "destructive",
        //         title: "Uh oh! Something went wrong.",
        //         description: "There was a problem with your request.",
        //     });
        //     clearAll({ type: ClearTypes.CLEAR_AUTH });
        // }

        if (status === "EMAIL_VERIFIED") router.visit(route("index"));
    }, [error, loading, userLoggedIn, status]);

    const doLogout = () => {
        logoutAction();
    };
    return (
        <>
            <Head title="Welcome" />

            <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-background bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">
                <div className="sm:fixed sm:top-0 sm:right-0 p-6 text-right">
                    {auth ? (
                        <Link
                            href={route("dashboard")}
                            className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route("login")}
                                className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                            >
                                Log in
                            </Link>

                            <Link
                                href={route("register")}
                                className="ml-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
                
                {verify_email ? (
                    <Alert>
                        <ActivityIcon className="h-4 w-4" />
                        <AlertTitle>
                            An email have been sent to youe email address.
                        </AlertTitle>
                        <AlertDescription>
                            verify your email first to use all feature{" "}
                        </AlertDescription>
                    </Alert>
                ) : null}
            </div>

            <style>{`
                .bg-dots-darker {
                    background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(0,0,0,0.07)'/%3E%3C/svg%3E");
                }
                @media (prefers-color-scheme: dark) {
                    .dark\\:bg-dots-lighter {
                        background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(255,255,255,0.07)'/%3E%3C/svg%3E");
                    }
                }
            `}</style>
        </>
    );
};

export default ({
    laravelVersion,
    phpVersion,
}: {
    laravelVersion: string;
    phpVersion: string;
}) => {
    const { user } = useTypedSelector((state) => state.auth);
    const urlParams = new URLSearchParams(window.location.search);
    const verify_email = urlParams.get("verify_email");

    if (verify_email) {
        return (
            <Welcome
                laravelVersion={laravelVersion}
                phpVersion={phpVersion}
                verify_email
                auth={user}
            />
        );
    } else {
        return (
            <Welcome
                laravelVersion={laravelVersion}
                phpVersion={phpVersion}
                auth={user}
            />
        );
    }
};
