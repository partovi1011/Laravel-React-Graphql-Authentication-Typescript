<?php

namespace App\GraphQL\Mutations\Auth;

use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Illuminate\Support\Facades\Auth;
use Exception;
use Illuminate\Support\Facades\Validator;

final class UpdateUser
{
    /**
     * Return a value for the field.
     *
     * @param  null  $root Always null, since this field has no parent.
     * @param  array{}  $args The field arguments passed by the client.
     * @param  \Nuwave\Lighthouse\Support\Contracts\GraphQLContext  $context Shared between all fields.
     * @param  \GraphQL\Type\Definition\ResolveInfo  $resolveInfo Metadata for advanced query resolution.
     * @return mixed
     */
    public function __invoke(mixed $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
         /** @var \App\Models\User $user **/
         $user = Auth::guard('sanctum')->user();
        $validateUser = Validator::make(
            $args,
            [
                'name' => [

                    'regex:/^[\pL\s\-]+$/u'
                ],
                'email' => [

                    "email",
                    'unique:users,email,'.$user->id
                ],

            ]
        );

        if ($validateUser->fails()) {
            return [
                'status' => "VALIDATION_ERROR",
                'errors' => $validateUser->errors()
            ];
        }
       
        $user->update($args);
        if ($user->wasChanged('email')) {
            $user->email_verified_at = null;
            $user->save();

            $user->sendEmailVerificationNotification();

            return [
                'user' => $user,
                'status' => "MUST_VERIFY_EMAIL"
            ];
        }
        return [
            'user' => $user,
            'status' => "SUCCESS"
        ];
    }
}
