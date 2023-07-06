import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm, router } from "@inertiajs/react";
import { FormEventHandler, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { FORGOT_PASSWORD } from "@/redux/mutations/UserMutations";
import { useTypedSelector } from "@/hooks/use-typed-selector";
import { useToast } from "@/Components/ui/use-toast";

const ForgotPassword = ({ status }: { status?: string }) => {
    const [
        sendForgotPasswordEmail,
        { data: dataForgot, loading: loadingForgot, error: errorForgot },
    ] = useMutation(FORGOT_PASSWORD);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
    });
    const { toast } = useToast();
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        sendForgotPasswordEmail({ variables: data });
    };
    useEffect(() => {
        if (dataForgot) {
            if (dataForgot.forgotPassword.status === "SUCCESS") {
                reset("email");
                toast({
                    title: "Password Reset Link has been sent to your email",
                });
            }
        }
    }, [dataForgot, errorForgot]);
    
    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Forgot your password? No problem. Just let us know your email
                address and we will email you a password reset link that will
                allow you to choose a new one.
            </div>

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData("email", e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ml-4" disabled={loadingForgot}>
                        Email Password Reset Link
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
        return <ForgotPassword />;
    }
};
