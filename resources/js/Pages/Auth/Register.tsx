import { useState, useEffect, FormEventHandler } from "react";
import { router } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { useActions } from "@/hooks/use-actions";
import { useTypedSelector } from "@/hooks/use-typed-selector";
import _ from "lodash";
import { ValidationErrors } from "@/redux/types/userType";
import { ClearTypes } from "@/redux/action-types";

const Register = () => {
    const [validationErrors, setValidationErrors] =
        useState<ValidationErrors | null>(null);
    const { registerAction, clearAll } = useActions();
    const { error, loading, userLoggedIn, must_verify_email } =
        useTypedSelector((state) => state.auth);
    const { data, setData, post, processing, errors, setError, reset } =
        useForm({
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
        });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    useEffect(() => {
        if (must_verify_email){
            clearAll({type: ClearTypes.CLEAR_AUTH})
            router.visit("/?verify_email=true");
        }
        if (userLoggedIn) router.visit(route("index"));
        if (error) setValidationErrors(error);
    }, [error, userLoggedIn, must_verify_email]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        registerAction(data);
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                    />

                    {!_.isNull(validationErrors) &&
                    !_.isUndefined(validationErrors["name"])
                        ? validationErrors["name"].map((message, i) => (
                              <InputError
                                  key={i}
                                  message={`* ${message}`}
                                  className="mt-2"
                              />
                          ))
                        : null}
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData("email", e.target.value)}
                        required
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
                        autoComplete="new-password"
                        onChange={(e) => setData("password", e.target.value)}
                        required
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

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        required
                    />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link
                        href={route("login")}
                        className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                    >
                        Already registered?
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
                            <>Register</>
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
        return <Register />;
    }
};
