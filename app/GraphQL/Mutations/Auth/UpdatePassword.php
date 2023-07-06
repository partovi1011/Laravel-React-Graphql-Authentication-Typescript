<?php

namespace App\GraphQL\Mutations\Auth;

use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Exception;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

final class UpdatePassword
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
            
            if (!Hash::check($args['current_password'], $user->password)) {
                return [
                    'status'=> "FAILED",
                    'errors' => ["current_password"=>['current password is wrong!']]
                ];
            }
            $validateUser = Validator::make(
                $args,
                [
                    'password' => [
                        'required',
                        Password::min(8)
                            ->letters()
                            ->mixedCase()
                            ->numbers(),
                        'confirmed'
                    ],
                ]
            );
    
            if ($validateUser->fails()) {
                return [
                    'status' => "VALIDATION_ERROR",
                    'errors' => $validateUser->errors()
                ];
            }
            $user->password = Hash::make($args['password']);
            $user->save();
            return [
                'status'=> "PASSWORD_CHANGED",
            ];
        
    }
}
