<?php

use App\Models\User;

Route::get('/users', function () {
    return User::all();
});

