<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\CheckoutConfig;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class LabController extends Controller
{
    public function index()
    {
        $configs = CheckoutConfig::where('company_id', Auth::user()->company_id)
            ->orderBy('is_active', 'desc')
            ->orderBy('updated_at', 'desc')
            ->get();

        return view('dashboard.lab', compact('configs'));
    }

    public function createAndEdit()
    {
        $config = new CheckoutConfig;
        $config->name = 'Novo Checkout '.date('d/m H:i');
        $config->slug = 'checkout-'.Str::random(8);
        $config->company_id = Auth::user()->company_id;
        $config->config = CheckoutConfig::defaultConfig();
        $config->save();

        return redirect()->route('dashboard.checkout-configs.edit', $config->id);
    }
}
