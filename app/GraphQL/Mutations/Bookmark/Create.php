<?php

namespace App\GraphQL\Mutations\Bookmark;

use App\Models\Bookmark;
use Illuminate\Support\Facades\Validator;
use App\Models\User;


final class Create
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $validateUser = Validator::make(
            $args,
            [
                'product' => 'required|exists:products,id',
                'user' => 'required|exists:users,id',
            ]
        );

        if ($validateUser->fails()) {
            return [
                'status' => "VALIDATION_ERROR",
                'errors' => $validateUser->errors()
            ];
        }

        $bookmark = Bookmark::create([
            'user_id' => $args['user'],
            'product_id' => $args['product'],
        ]);
        User::find($args['user'])->bookmarks()->save($bookmark);
        return [
            'status' => 'SUCCESS',
            'bookmark' => $bookmark,
        ];
    }
}
