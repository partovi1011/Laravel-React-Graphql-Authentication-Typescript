<?php

namespace App\GraphQL\Mutations\Comment;

use Illuminate\Support\Facades\Validator;
use App\Models\Comment;
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
                'comment' => 'required|string',
            ]
        );

        if ($validateUser->fails()) {
            return [
                'status' => "VALIDATION_ERROR",
                'errors' => $validateUser->errors()
            ];
        }
        $comment = Comment::create([
            'user_id' => $args['user'],
            'product_id' => $args['product'],
            'feed' => $args['comment'],
        ]);
        User::find($args['user'])->comments()->save($comment);
        return [
            'status' => 'SUCCESS',
            'comment' => $comment,
        ];
    }
}
