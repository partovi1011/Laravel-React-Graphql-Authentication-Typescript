<?php

namespace App\GraphQL\Mutations\Product;

use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

use Illuminate\Support\Facades\Validator;
use App\Models\Product;
use App\Models\Tag;
use Illuminate\Support\Facades\Log;
final class Create
{
    /**
     * Return a value for the field.
     *
     * @param  null  $root Always null, since this field has no parent.
     * @param  array{}  $args The field arguments passed by the client.
     * @param  \Nuwave\Lighthouse\Support\Contracts\GraphQLContext  $context Shared between all fields.
     * @param  \GraphQL\Type\Definition\ResolveInfo  $resolveInfo Metadata for advanced query resolution.
     * @return mixed
     */
    public function __invoke(mixed $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        $validateUser = Validator::make(
            $args,
            [
                'name' => 'required|string',
                'description' => 'required|string',
                'price' => 'required|numeric',
                'stock' => 'required|numeric',
                'tags' => 'array',
                'tags.*' => 'string',
            ]
        );

        if ($validateUser->fails()) {
            return [
                'status' => "VALIDATION_ERROR",
                'errors' => $validateUser->errors()
            ];
        }
        $ids =[];
        foreach($args['tags'] as $tag) {
            $getTag = Tag::firstOrCreate(['name' => $tag]);
            array_push($ids, $getTag->id);
    
        }
        $data = collect($args)->except('tags')->toArray();
        $product = Product::create($data);
        $product->tags()->sync($ids);
        return [
            "product"=>$product,
            "status"=>"SUCCESS"
        ];
    }
}
