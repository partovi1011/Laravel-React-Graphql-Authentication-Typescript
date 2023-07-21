<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class Product extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'images' => 'array'
    ];

    public function scopeIsPublished(Builder $query, bool $isPublished): Builder
    {
        if ($isPublished) {
            return $query->where('published', '=', $isPublished);
        }
        return $query;
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'products_tags');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function discount()
    {
        $now = Carbon::now()->toDateString();
        return $this->hasOne(Discount::class)->whereRaw("discounted_from <=  date('$now')")
            ->whereRaw("discounted_to >=  date('$now')")->latestOfMany();
    }
}
