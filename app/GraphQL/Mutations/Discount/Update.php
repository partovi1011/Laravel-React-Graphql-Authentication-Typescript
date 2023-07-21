<?php

namespace App\GraphQL\Mutations\Discount;

use Illuminate\Support\Facades\Validator;
use App\Models\Discount;


final class Update
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
                'discount' => 'required|exists:discounts,id',
                'price' => 'numeric',
                'discounted_from' => '',
                'discounted_to' => '',
            ]
        );

        if ($validateUser->fails()) {
            return [
                'status' => "VALIDATION_ERROR",
                'errors' => $validateUser->errors()
            ];
        }
        $data = collect($args)->except('discount')->toArray();
        $discount = Discount::find($args['discount']);
        $discount->update($data);
        return [
            'status' => "SUCCESS",
            'discount' => $discount->refresh()
        ];
    }
}
