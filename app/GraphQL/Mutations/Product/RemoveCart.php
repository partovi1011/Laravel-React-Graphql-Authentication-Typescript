<?php

namespace App\GraphQL\Mutations\Product;

use App\Models\Cart;
use Illuminate\Support\Facades\Validator;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Log;

final class RemoveCart
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $validation = Validator::make(
            $args,
            [
                'product' => 'exists:products,id',
                'user' => 'exists:users,id',
            ]
        );

        if ($validation->fails()) {
            return [
                'status' => "VALIDATION_ERROR",
                'errors' => $validation->errors()
            ];
        }

        User::find($args['user'])->carts()->where('product_id', $args['product'])->delete();
        $carts = User::find($args['user'])->carts;
        $total = 0;
        if (count($carts)) {
            foreach ($carts as $cart) {
                $total += $cart->quantity * $cart->product->price;
            }
        }
        return [
            'status' => 'SUCCESS',
            'carts' => User::find($args['user'])->carts,
            'total' => $total,
        ];
    }
}
