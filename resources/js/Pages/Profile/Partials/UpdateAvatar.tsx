import React, { ChangeEvent } from "react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { User } from "@/redux/types/userType";
import _ from "lodash";
import { useActions } from "@/hooks/use-actions";

const UpdateAvatar = ({
    className = "",
    user,
}: {
    className?: string;
    user: User | null;
}) => {
    const { updateAvatarAction } = useActions();

    const changeAvatar = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            updateAvatarAction({ file });
        }
    };

    return (
        <section className={`${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Change Avatar
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Make fancy your profile with avatar
                </p>
            </header>
            <div className=" flex items-center gap-6 my-6">
                {!_.isNull(user) && user.avatar ? (
                    <Avatar>
                        <AvatarImage
                            src={`/storage${user.avatar.replace("public", "")}`}
                        />
                        <AvatarFallback>
                            {user.name.substring(0, 1)}
                        </AvatarFallback>
                    </Avatar>
                ) : null}
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="picture">Avatar</Label>
                    <Input id="picture" type="file" onChange={changeAvatar} />
                </div>
            </div>
        </section>
    );
};

export default UpdateAvatar;
