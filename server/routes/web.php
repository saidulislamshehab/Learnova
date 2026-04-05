<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('app');
});

Route::get('/clear-cache', function () {
    \Illuminate\Support\Facades\Artisan::call('route:clear');
    return 'Routes cleared!';
});

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');