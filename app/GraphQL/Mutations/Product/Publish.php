<?php

namespace App\GraphQL\Mutations\Product;
use Illuminate\Support\Facades\Validator;
use App\Models\Product;
use App\Models\Tag;
use Illuminate\Support\Facades\Log;


final class Publish
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
                'publish' => 'boolean',
                
            ]
        );

        if ($validation->fails()) {
            return [
                'status' => "VALIDATION_ERROR",
                'errors' => $validation->errors()
            ];
        }
        $data = collect($args)->except('product')->except('tags')->toArray();
        $product = Product::where('id', (int)$args['product'])->firstOrFail();
        $product->published = $args['publish'];
        $product->save();

        return [
            "product"=>$product->refresh(),
            "status"=>"SUCCESS"
        ];
    }
}
