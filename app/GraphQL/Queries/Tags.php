<?php

namespace App\GraphQL\Queries;

use App\Models\Tag;

final class Tags
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $tags = Tag::all();
        return $tags;
    }
}
