<?php

namespace App\GraphQL\Mutations\Auth;

use Exception;
use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

final class ResetPassword
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
        $validateUser = Validator::make(
            $args,
            [
                'email' => 'required|email|exists:users',
                'password' => [
                    'required',
                    PasswordRule::min(8)
                        ->letters()
                        ->mixedCase()
                        ->numbers(),
                    'confirmed'
                ],
                'password_confirmation' => 'required'
            ]
        );

        if ($validateUser->fails()) {
            return [
                'status' => "VALIDATION_ERROR",
                'errors' => $validateUser->errors()
            ];
        }
        try {
            $response = $this->broker()->reset($args, function ($user, $password) {
                $this->resetPassword($user, $password);
            });

            if ($response === Password::PASSWORD_RESET) {
                return [
                    'status'  => 'SUCCESS',
                ];
            }
        } catch (Exception $err) {
            return [
                'status'  => 'FAILED',
                'message' => ["reset" => ['Something went wrong']],
            ];
        }
    }

    /**
     * Reset the given user's password.
     *
     * @param  App\Models\User $user
     * @param  string  $password
     * @return void
     */
    protected function resetPassword($user, $password)
    {
        $user->password = Hash::make($password);

        $user->save();

        event(new PasswordReset($user));
    }

    /**
     * Get the broker to be used during password reset.
     *
     * @return \Illuminate\Contracts\Auth\PasswordBroker
     */
    protected function broker()
    {
        return Password::broker();
    }
}
