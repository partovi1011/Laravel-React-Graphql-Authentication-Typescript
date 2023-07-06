<?php

namespace App\GraphQL\Mutations\Auth;

use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Password;
use Exception;

final class ForgotPassword
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
            ]
        );

        if ($validateUser->fails()) {
            return [
                'status' => "VALIDATION_ERROR",
                'errors' => $validateUser->errors()
            ];
        }

        try {
            Password::sendResetLink(
                $args
            );

            return [
                'status' => "SUCCESS",
            ];
        } catch (Exception $e) {
            return [
                'status' => "FAILED",
                "errors" => $e
            ];
        }
    }
}
