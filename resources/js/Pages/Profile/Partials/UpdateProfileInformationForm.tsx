import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { FormEventHandler, useEffect, useState } from "react";
import { useTypedSelector } from "@/hooks/use-typed-selector";
import { useActions } from "@/hooks/use-actions";
import { ClearTypes } from "@/redux/action-types";
import { ValidationErrors } from "@/redux/types/userType";
import _ from "lodash";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    className = "",
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const [validationErrors, setValidationErrors] =
        useState<ValidationErrors | null>(null);
    const { updateUserAction, clearAll } = useActions();
    const {
        user,
        status: updateUserStatus,
        loading,
        error,
        status,
    } = useTypedSelector((state) => state.auth);
    
    const { data: formData, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user?.name,
            email: user?.email,
        });

    

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        updateUserAction(formData);
    };

    useEffect(()=>{
        if (!_.isNull(user)){
            setData((data: typeof formData) => ({
                ...data,
                name: user.name,
            }));
            setData((data: typeof formData) => ({
                ...data,
                email: user.email,
            }));
        }
    },[user])
    useEffect(() => {
        if (updateUserStatus === "MUST_VERIFY_EMAIL") {
            clearAll({ type: ClearTypes.CLEAR_AUTH });
            router.visit("/?verify_email=true");
        }
        if (!_.isUndefined(error) && status === "VALIDATION_ERROR") {
            setValidationErrors(error);
        }
    }, [updateUserStatus, error, status]);
    useEffect(()=>{console.log(validationErrors);
    },[validationErrors])
    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={formData.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
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

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={formData.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="username"
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

                {mustVerifyEmail && user?.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800 dark:text-gray-200">
                            Your email address is unverified.
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={loading}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enterFrom="opacity-0"
                        leaveTo="opacity-0"
                        className="transition ease-in-out"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
