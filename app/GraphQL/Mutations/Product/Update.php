<?php

namespace App\GraphQL\Mutations\Product;
use Illuminate\Support\Facades\Validator;
use App\Models\Product;
use App\Models\Tag;
use Illuminate\Support\Facades\Log;


final class Update
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
                'name' => 'string',
                'description' => 'string',
                'price' => 'numeric',
                'stock' => 'numeric',
                'tags' => 'array',
                'tags.*' => 'string',
            ]
        );

        if ($validation->fails()) {
            return [
                'status' => "VALIDATION_ERROR",
                'errors' => $validation->errors()
            ];
        }
        $ids =[];
        foreach($args['tags'] as $tag) {
            $getTag = Tag::firstOrCreate(['name' => $tag]);
            array_push($ids, $getTag->id);
    
        }
        $data = collect($args)->except('product')->except('tags')->toArray();

        $product = Product::where('id', (int)$args['product'])->firstOrFail();
        $product->update($data);
        $product->tags()->sync($ids);

        return [
            "product"=>$product->refresh(),
            "status"=>"SUCCESS"
        ];
    }
}
