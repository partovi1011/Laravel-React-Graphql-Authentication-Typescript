import { useRef, FormEventHandler, useState, useEffect } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import _ from "lodash";
import { useTypedSelector } from "@/hooks/use-typed-selector";
import { useActions } from "@/hooks/use-actions";
import { ClearTypes } from "@/redux/action-types";
import { useToast } from "@/Components/ui/use-toast";
import { ValidationErrors } from "@/redux/types/userType";
export default function UpdatePasswordForm({
    className = "",
}: {
    className?: string;
}) {
    const { toast } = useToast();
    const passwordInput = useRef<HTMLInputElement>();
    const currentPasswordInput = useRef<HTMLInputElement>();
    const { updatePasswordAction, clearAll } = useActions();
    const { loading, status, error } = useTypedSelector((state) => state.auth);
    const [validationErrors, setValidationErrors] =
        useState<ValidationErrors | null>(null);
    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();
        updatePasswordAction(data);
        // put(route('password.update'), {
        //     preserveScroll: true,
        //     onSuccess: () => reset(),
        //     onError: (errors) => {
        //         if (errors.password) {
        //             reset('password', 'password_confirmation');
        //             passwordInput.current?.focus();
        //         }

        //         if (errors.current_password) {
        //             reset('current_password');
        //             currentPasswordInput.current?.focus();
        //         }
        //     },
        // });
    };
    useEffect(() => {
        if (error) {
            setValidationErrors(error);

            clearAll({ type: ClearTypes.CLEAR_AUTH });
        }
        if (status && status === "PASSWORD_CHANGED") {
            reset("password", "current_password", "password_confirmation");
            
            setValidationErrors(null);
            clearAll({ type: ClearTypes.CLEAR_AUTH });
            toast({
                title: "Password has been changed",
            });
        }
    }, [loading, status, error]);

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Update Password
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Ensure your account is using a long, random password to stay
                    secure.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value="Current Password"
                    />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData("current_password", e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                    />

                    {!_.isNull(validationErrors) &&
                    !_.isUndefined(validationErrors["current_password"])
                        ? validationErrors["current_password"].map(
                              (message, i) => (
                                  <InputError
                                      key={i}
                                      message={`* ${message}`}
                                      className="mt-2"
                                  />
                              )
                          )
                        : null}
                </div>

                <div>
                    <InputLabel htmlFor="password" value="New Password" />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
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

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={loading}>
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
                            <>Save</>
                        )}
                    </PrimaryButton>

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
