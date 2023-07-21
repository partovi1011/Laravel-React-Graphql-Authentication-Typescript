<?php

namespace App\GraphQL\Mutations\Order;


use App\Models\Order;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Log;

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
                'user' => 'required|exists:users,id',
                'name' => 'required|alpha',
                'tel' => 'required|numeric',
                'address' => 'required|string',
                'zip' => 'required|numeric',
                'note' => 'string',
                'shipping_price' => 'required|numeric',
            ]
        );

        if ($validateUser->fails()) {
            return [
                'status' => "VALIDATION_ERROR",
                'errors' => $validateUser->errors()
            ];
        }
        $user = User::find($args['user']);

        if (!$user->carts()->exists()) {
            return [
                'status' => "FAILED",
                'errors' => ["failed" => ['cart is empty']]
            ];
        }
        foreach ($user->carts as $cart) {
            if ($cart->product->stock < $cart->quantity) {
                return [
                    'status' => 'FAILED',
                    'errors' => ['failed' => ['تعداد درخواستی بیشتر از موجودی محصول است']]
                ];
            }
        }
        $data = collect($args)->except('user')->toArray();
        $order = Order::create([
            ...$data, "user_id" => $args['user'],
            'total' => 10000
        ]);

        $ids = [];
        $userCarts = User::find($args['user'])->carts->all();
        foreach ($userCarts as $cart) {
            array_push($ids, $cart->id);
            $cart->product->stock = $cart->product->stock - $cart->quantity;
            $cart->product->sold = $cart->product->sold + $cart->quantity;
            $cart->product->save();
            $cart->status = "ordered";
            $cart->save();
        }
        $order->carts()->sync($ids);
        User::find($args['user'])->orders()->save($order);
        return [
            'status' => 'SUCCESS',
            'order' => $order->refresh(),
        ];
    }
}
