import { useState, useEffect, FormEventHandler } from "react";
import Checkbox from "@/Components/Checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { useTypedSelector } from "@/hooks/use-typed-selector";
import { useActions } from "@/hooks/use-actions";
import { ValidationErrors } from "@/redux/types/userType";
import _ from "lodash";
import { router } from "@inertiajs/react";
import { useToast } from "@/Components/ui/use-toast";
import { ClearTypes } from "@/redux/action-types";

const Login = () => {
    const { toast } = useToast();
    const [validationErrors, setValidationErrors] =
        useState<ValidationErrors | null>(null);
    const { loginAction, clearAll } = useActions();
    const { error, loading, userLoggedIn, must_verify_email } =
        useTypedSelector((state) => state.auth);
    const { data, setData, reset } = useForm({
        email: "",
        password: "",
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    useEffect(() => {
        if (must_verify_email) {
            clearAll({ type: ClearTypes.CLEAR_AUTH });
            router.visit("/?verify_email=true");
        }
        if (userLoggedIn) router.visit(route("index"));
        if (error) {
            if (!_.isUndefined(error["failed"])) {
                toast({
                    variant: "destructive",
                    title: error["failed"][0],
                });
            } else {
                setValidationErrors(error);
            }
            clearAll({ type: ClearTypes.CLEAR_AUTH });
        }
    }, [error, userLoggedIn, must_verify_email]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        loginAction(data);
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                    />
                    {!_.isNull(validationErrors) &&
                    !_.isUndefined(validationErrors["email"])
                        ? validationErrors["email"].map((message, i) => (
                              <InputError
                                  key={i}
                                  message={`* ${message}`}
                                  className="mt-2"
                              />
                          ))
                        : null}
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData("password", e.target.value)}
                    />
                    {!_.isNull(validationErrors) &&
                    !_.isUndefined(validationErrors["password"])
                        ? validationErrors["password"].map((message, i) => (
                              <InputError
                                  key={i}
                                  message={`* ${message}`}
                                  className="mt-2"
                              />
                          ))
                        : null}
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link
                        href={route("password.request")}
                        className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                    >
                        Forgot your password?
                    </Link>

                    <PrimaryButton className="ml-4" disabled={loading}>
                        {loading ? (
                            <>
                                <svg
                                    className="h-4 w-4 animate-spin"
                                    viewBox="3 3 18 18"
                                >
                                    <path
                                        className="fill-gray-800"
                                        d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                                    ></path>
                                    <path
                                        className="fill-gray-100"
                                        d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
                                    ></path>
                                </svg>
                                <span className="ml-2">Loading...</span>
                            </>
                        ) : (
                            <>Log in</>
                        )}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
};

export default () => {
    const { userLoggedIn } = useTypedSelector((state) => state.auth);
    if (userLoggedIn) {
        router.visit(route("index"));
    } else {
        return <Login />;
    }
};
