<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;

class LabController extends Controller
{
    public function index()
    {
        return view('dashboard.lab');
    }
}
