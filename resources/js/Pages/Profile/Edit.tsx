import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { Head, router } from "@inertiajs/react";
import { useTypedSelector } from "@/hooks/use-typed-selector";
import { User } from "@/redux/types/userType";
import _ from "lodash";
import UpdateAvatar from "./Partials/UpdateAvatar";
import { useEffect } from "react";

interface PageProps {
    auth: User | null;
    mustVerifyEmail: boolean;
    status?: string;
}
const Edit: React.FC<PageProps> = ({ auth, mustVerifyEmail, status }) => {
   
    return (
        <AuthenticatedLayout
            user={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <UpdateAvatar className="max-w-xl" user={auth} />
                    </div>

                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>
{/* 
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <DeleteUserForm className="max-w-xl" />
                    </div> */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default () => {
    const { user, must_verify_email } = useTypedSelector((state) => state.auth);
    // if (_.isNull(user)) {
    //     router.visit(route('index'))
    // }

    return <Edit auth={user} mustVerifyEmail={must_verify_email} />;
};
