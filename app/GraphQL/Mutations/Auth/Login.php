<?php

namespace App\GraphQL\Mutations\Auth;

use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use DeviceDetector\DeviceDetector;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
final class Login
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
        $parse_device_name = new DeviceDetector($context->request()->server('HTTP_USER_AGENT'));
        $parse_device_name->parse();
        $validateUser = Validator::make(
            $args,
            [
                'email' => 'required|email',
                'password' => 'required'
            ]
        );

        if ($validateUser->fails()) {
            return [
                'status' => "VALIDATION_ERROR",
                'errors' => $validateUser->errors()
            ];
        }

        if (!Auth::attempt($args)) {
            return [
                'status' => "FAILED",
                "errors"=> ["failed" => ['password or email is not correct!']],

            ];
        }

        $user = User::where('email', $args['email'])->first();
        if ($user instanceof MustVerifyEmail && !$user->hasVerifiedEmail()) {
            
            return [
                'status' => 'MUST_VERIFY_EMAIL',
            ];
        }
        return [
            'status' => "LOGIN",
            'user' => $user,
            'token' => $user->createToken($parse_device_name->getDeviceName())->plainTextToken
        ];
    }
}
