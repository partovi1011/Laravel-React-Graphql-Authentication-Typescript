<?php

namespace App\GraphQL\Queries;
use App\Models\Payment as PaymentModel;


final class Payment
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        return PaymentModel::find($args['payment']);
    }
}
