<?php

namespace App\GraphQL\Mutations\Auth;

use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Illuminate\Support\Facades\Auth;
use Exception;


final class UpdateAvatar
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
         /** @var \Illuminate\Http\UploadedFile $file */
         $file = $args['file'];

         $uploaded = $file->storePublicly('public/avatars');
         $response = $this->checkAndUpdate($uploaded);
         return $response;
    }

    private function checkAndUpdate(string $path): mixed
    {
        try {

            /** @var \App\Models\User $user **/
            $user = Auth::guard('sanctum')->user();
    
            if (!is_null($user->avatar)) {
                unlink(storage_path('app/' . $user->avatar));
            }
            $user->avatar = $path;
            $user->save();
            return [
                'user' => $user,
                'status' => 'AVATAR_CHANGED'
             ];
        } catch (Exception $err) {
            return [
                'status' => 'FAILED'
             ];
        }
    }
}
