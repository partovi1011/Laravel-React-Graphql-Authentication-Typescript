<?php

namespace App\GraphQL\Mutations\Discount;

use App\Models\Discount;
use Illuminate\Support\Facades\Validator;

final class Remove
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

            ]
        );

        if ($validateUser->fails()) {
            return [
                'status' => "VALIDATION_ERROR",
                'errors' => $validateUser->errors()
            ];
        }

        Discount::find($args['discount'])->delete();
        return [
            'status' => "SUCCESS",
        ];
    }
}
