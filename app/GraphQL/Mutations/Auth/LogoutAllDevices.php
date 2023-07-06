<?php

namespace App\GraphQL\Mutations\Auth;

use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Illuminate\Support\Facades\Auth;

final class LogoutAllDevices
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
        if (!Auth::guard('sanctum')->check()) {
            return [
                'status' => 'NOT_AUTHORIZED',
            ];
        }
        /** @var \App\Models\User $user **/
        $user = Auth::guard('sanctum')->user();
        $user->tokens()->delete();
        return [
            'status' => 'LOGOUT',
        ];
    }
}
