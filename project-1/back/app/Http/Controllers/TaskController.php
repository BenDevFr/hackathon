<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUpdateTasksRequest;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $tasks = Task::all();
        return response()->json(
            [
                'message' => '200 Ok',
                'data' => $tasks
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreUpdateTasksRequest $request)
    {
        $request->validate(
            [
                'title' => 'required',
                'description' => 'required'
            ]
        );

        $data = Task::create($request->all());

        return response()->json(
            [
                'message' => 'Data Successfully Stored!',
                'data' => $data
            ]
        );
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function show(Task $task)
    {
        $selectedTask = Task::find($task);

        if (!$selectedTask) {
            return response()->json(
                [
                    'message' => '404 This task does not exist',
                    'data' => 'Null'
                    //don't work ???
                ]
            );
        }
        return response()->json(
            [
                'message' => '200 Ok',
                'data' =>  $selectedTask
            ]
        );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Task $task)
    {
        $request->validate(
            [
                'title' => 'required',
                'description' => 'required'
            ]
        );

        $task->title = $request->title;
        $task->description = $request->description;
        $task->save();

        return response()->json(
            [
                'message' => 'Data Successfully updated!',
                'data' => $task
            ]
        );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        $task = Task::find($id);
        if ($task) {
            $task->delete();
            return response()->json(
                [
                    'message' => 'Task n°' . $task->id . ' deleted',
                    'data' => 'Null'
                ]
            );
        }
        return response()->json([
            'message' => '404 This task does not exist',
            'data' => 'Null'

        ]);
    }
}
