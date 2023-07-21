<?php

namespace App\GraphQL\Mutations\Product;

use App\Models\Cart;
use Illuminate\Support\Facades\Validator;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Log;


final class AddToCart
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
                'quantity' => 'required|integer'

            ]
        );

        if ($validation->fails()) {
            return [
                'status' => "VALIDATION_ERROR",
                'errors' => $validation->errors()
            ];
        }

        $productHasStock = Product::find($args['product'])->stock >= $args['quantity'];
        if (!$productHasStock) {
            return [
                'status' => "FAILED",
                'errors' => ["failed" => ['has No Stock']]
            ];
        }
        $user_carts = User::find($args['user'])->carts()->where('product_id', $args['product'])
            ->exists();
        if (!$user_carts) {
            $cart = Cart::create([
                'user_id' => $args['user'],
                'product_id' => $args['product'],
                'quantity' => $args['quantity'],
            ]);
            User::find($args['user'])->carts()->save($cart);
        } else {
            User::find($args['user'])->carts()->where('product_id', $args['product'])->update([
                'quantity' => $args['quantity']
            ]);
        }
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
