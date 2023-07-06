<?php

namespace App\GraphQL\Mutations\Auth;

use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use DeviceDetector\DeviceDetector;

final class Register
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
                'name' => [
                    'required',
                    'regex:/^[\pL\s\-]+$/u'
                ],
                'email' => [
                    'required',
                    "email",
                    'unique:users,email',
                ],
                'password' => [
                    'required',
                    'confirmed',
                    Password::min(8)
                        ->letters()
                        ->mixedCase()
                        ->numbers()
                ]
            ]
        );

        if ($validateUser->fails()) {
            return [
                'status' => "VALIDATION_ERROR",
                'errors' => $validateUser->errors()
            ];
        }
        $user = User::create([
            "name" => $args['name'],
            "email" => $args['email'],
            "password" => Hash::make($args['password']),
        ]);
        if ($user instanceof MustVerifyEmail) {
            event(new Registered($user));
            return [
                'status' => 'MUST_VERIFY_EMAIL',
            ];
        }

        $token = $user->createToken($parse_device_name->getDeviceName());

        event(new Registered($user));

        return [
            'token' => $token->plainTextToken,
            'user' => $user,
            'status' => 'SUCCESS',
        ];
    }
}
