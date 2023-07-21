<?php

namespace App\GraphQL\Mutations\Product;

use App\Models\Product;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Builder;

final class Filter
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args): Builder
    {

        $products = Product::query();
        $products->where('published', '=', true)
            ->where(function (Builder $query) {
                $tags = $args['tags'] ?? [];
                if (count($tags)) {

                    $query->orWhereHas('tags', function ($q) use ($tags) {

                        $q->whereIn('name', $tags);
                    });
                };
                if (isset($args['name'])) {
                    $query->orWhere('name', 'ILIKE', '%' . $args['name'] . '%');
                }
            });
        if (isset($args['orderBy'])) {
            $sort = $args['sort'] ?? 'asc';
            $products->orderBy($args['orderBy'], $sort);
        }
        return $products;
    }
}
