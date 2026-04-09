<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Subscription;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $uuid = $request->get('uuid');
        
        if ($uuid) {
            $transaction = Transaction::where('uuid', $uuid)->first();
            $subscription = Subscription::where('uuid', $uuid)->first();
            
            if ($transaction) {
                return redirect()->route('checkout.pay', $uuid);
            }
            
            if ($subscription) {
                return redirect()->route('checkout.pay', $uuid);
            }
            
            return view('home', [
                'error' => 'Checkout não encontrado. Verifique o código e tente novamente.',
                'uuid' => $uuid
            ]);
        }
        
        return view('home');
    }
}
