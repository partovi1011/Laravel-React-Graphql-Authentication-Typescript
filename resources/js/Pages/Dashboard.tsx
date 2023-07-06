import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useTypedSelector } from '@/hooks/use-typed-selector';
import { User as UserType } from '@/redux/types/userType';

interface PageProps {
    auth: UserType | null
}
const Dashboard: React.FC<PageProps> = ({ auth }) => {
    return (
        <AuthenticatedLayout
            user={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">You're logged in!</div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
export default () => {
    const { userLoggedIn, user } = useTypedSelector((state) => state.auth);
    if (!userLoggedIn) {
        router.visit(route("index"));
    } else {
        return <Dashboard auth={user} />;
    }
};