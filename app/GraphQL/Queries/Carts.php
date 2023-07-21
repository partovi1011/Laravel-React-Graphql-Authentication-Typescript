<?php

namespace App\GraphQL\Queries;

use App\Models\Cart;

final class Carts
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        return Cart::all();
    }
}
