<?php

namespace App\GraphQL\Mutations\Discount;

use App\Models\Discount;
use Illuminate\Support\Facades\Validator;

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
                'price' => 'required|numeric',
                'discounted_from' => 'required',
                'discounted_to' => 'required',

            ]
        );

        if ($validateUser->fails()) {
            return [
                'status' => "VALIDATION_ERROR",
                'errors' => $validateUser->errors()
            ];
        }
        $data = collect($args)->except('product')->toArray();
        $discount = Discount::create([...$data, 'product_id' => $args['product']]);
        return [
            'status' => "SUCCESS",
            'discount' => $discount
        ];
    }
}
