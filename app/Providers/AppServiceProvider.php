<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use MLL\GraphQLScalars\MixedScalar;
use Nuwave\Lighthouse\Schema\TypeRegistry;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $typeRegistry = app(TypeRegistry::class);
        $typeRegistry->register(new MixedScalar());
    }
}
