<?php

namespace App\GraphQL\Mutations\Comment;
use Illuminate\Support\Facades\Validator;
use App\Models\Comment;


final class Publish
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
                'comment' => 'required|exists:comments,id',
                'publish' => 'required|boolean',
            ]
        );

        if ($validateUser->fails()) {
            return [
                'status' => "VALIDATION_ERROR",
                'errors' => $validateUser->errors()
            ];
        }

        $comment = Comment::find($args['comment']);
        $comment->update(['published'=>$args['publish'], 'published_at'=> now()]);
        return [
            'status' => 'SUCCESS',
            'comment' => $comment->refresh(),
        ];
    }
}
