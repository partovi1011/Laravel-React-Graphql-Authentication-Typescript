import { useEffect, FormEventHandler, useState } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, router, useForm } from "@inertiajs/react";
import { RESET_PASSWORD } from "@/redux/mutations/UserMutations";
import { useMutation } from "@apollo/client";
import { ValidationErrors } from "@/redux/types/userType";
import _ from "lodash";
export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const [
        resetPassword,
        { data: dataReset, loading: loadingReset, error: errorReset },
    ] = useMutation(RESET_PASSWORD);
    const [validationErrors, setValidationErrors] =
        useState<ValidationErrors | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        resetPassword({ variables: data });
    };
    useEffect(() => {
        if (dataReset) {
            if (dataReset.resetPassword.status === "FAILED") {
                setValidationErrors(dataReset.resetPassword.errors);
            } else {
                router.visit(route('login'))
            }
            
        }
    }, [dataReset, loadingReset, errorReset]);
    return (
        <GuestLayout>
            <Head title="Reset Password" />

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
                        autoComplete="new-password"
                        isFocused={true}
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

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                    />

                    {!_.isNull(validationErrors) &&
                    !_.isUndefined(validationErrors["password_confirmation"])
                        ? validationErrors["password_confirmation"].map(
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

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ml-4" disabled={loadingReset}>
                        Reset Password
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
