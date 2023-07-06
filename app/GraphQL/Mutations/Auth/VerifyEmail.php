<?php

namespace App\GraphQL\Mutations\Auth;

use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Events\Verified;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Carbon;


final class VerifyEmail
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
        try {
            $user = User::where('email_verify_token', $args['token'])
                ->where('email', $args['email'])
                ->firstOrFail();

            $expiration = $user->email_verify_expire;

            if (Carbon::parse($expiration) < now()) {
                return [
                    'status' => 'FAILED',
                ];
            }
            $user->markEmailAsVerified();

            $user->email_verify_token = null;
            $user->email_verify_expire = null;
            $user->save();

            event(new Verified($user));
            // Auth::setUser($user);

            return [
                'status' => 'EMAIL_VERIFIED',
                'token' => $user->createToken("API TOKEN")->plainTextToken,
                'user' => $user,
            ];
        } catch (ModelNotFoundException $e) {
            return [
                "status" => "FAILED",
            ];
        }
    }
}
