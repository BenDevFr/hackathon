<?php

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/toto', function () {
    return [
        "toto" => "Youpi",
    ];
});

Route::post('/newtask', function (Request $request) {

    $task = new Task();
    $task->title = $request->title;
    $task->description = $request->description;
    $task->save();
    return $task;
});
