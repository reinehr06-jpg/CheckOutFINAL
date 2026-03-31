<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
    <title><?php echo e($transaction->description ?? 'Pagamento'); ?> - Basileia</title>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { font-family: 'Inter', sans-serif; }
        body { background: #f8fafc; }
        .payment-card.active { border-color: #2563eb; background: #eff6ff; }
        input:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
        .checkbox-wrapper input:checked + div { background: #2563eb; border-color: #2563eb; }
        .checkbox-wrapper input:checked + div svg { display: block; }
        [x-cloak] { display: none !important; }
    </style>
</head>
<body class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
        <div class="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                    <span class="text-white font-bold text-lg">B</span>
                </div>
                <div>
                    <h1 class="text-lg font-bold text-gray-900">Basileia</h1>
                    <p class="text-xs text-gray-500">Portal de Payments</p>
                </div>
            </div>
            <div x-data="{ 
                countries: [
                    {code: 'BR', name: 'Brasil', lang: 'pt-BR', currency: 'BRL', symbol: 'R$'},
                    {code: 'US', name: 'United States', lang: 'en-US', currency: 'USD', symbol: '$'},
                    {code: 'ES', name: 'España', lang: 'es-ES', currency: 'EUR', symbol: '€'},
                    {code: 'PT', name: 'Portugal', lang: 'pt-PT', currency: 'EUR', symbol: '€'},
                ],
                selected: 'BR',
                get current() { return this.countries.find(c => c.code === this.selected); }
            }">
                <select x-model="selected" class="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white cursor-pointer">
                    <template x-for="country in countries" :key="country.code">
                        <option :value="country.code" x-text="country.name"></option>
                    </template>
                </select>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 py-6 px-4">
        <div class="max-w-md mx-auto">
            <!-- Order Summary -->
            <div class="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Resumo do Pedido</h2>
                <div class="space-y-3">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-gray-900 font-medium"><?php echo e($transaction->description ?? 'Plano Premium'); ?></p>
                            <p class="text-sm text-gray-500"><?php echo e($transaction->customer_name ?? 'Igreja Teste'); ?></p>
                        </div>
                    </div>
                    <div class="pt-3 border-t border-gray-100 flex justify-between items-center">
                        <span class="text-gray-700 font-medium">Total</span>
                        <div class="text-right">
                            <span class="text-2xl font-bold text-gray-900">
                                R$ <?php echo e(number_format($transaction->amount / ($installments ?? 1), 2, ',', '.')); ?>

                            </span>
                            <?php if(($installments ?? 1) > 1): ?>
                                <p class="text-xs text-gray-500">em <?php echo e($installments); ?>x de R$ <?php echo e(number_format($transaction->amount / $installments, 2, ',', '.')); ?></p>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Payment Method -->
            <div class="bg-white rounded-2xl border border-gray-200 p-5 mb-5" x-data="{ method: '<?php echo e($paymentMethod); ?>' || 'pix' }">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Forma de Pagamento</h2>
                
                <div class="space-y-3">
                    <!-- PIX -->
                    <label class="block cursor-pointer">
                        <input type="radio" name="payment_method" value="pix" x-model="method" class="sr-only">
                        <div class="payment-card flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 transition-all">
                            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
                                </svg>
                            </div>
                            <div class="flex-1">
                                <p class="font-medium text-gray-900">PIX</p>
                                <p class="text-sm text-gray-500">Transferência imediata</p>
                            </div>
                            <div class="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                <div class="w-2.5 h-2.5 rounded-full bg-transparent"></div>
                            </div>
                        </div>
                    </label>

                    <!-- Boleto -->
                    <label class="block cursor-pointer">
                        <input type="radio" name="payment_method" value="boleto" x-model="method" class="sr-only">
                        <div class="payment-card flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 transition-all">
                            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                            </div>
                            <div class="flex-1">
                                <p class="font-medium text-gray-900">Boleto Bancário</p>
                                <p class="text-sm text-gray-500">Vence em 3 dias</p>
                            </div>
                            <div class="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                <div class="w-2.5 h-2.5 rounded-full bg-transparent"></div>
                            </div>
                        </div>
                    </label>

                    <!-- Credit Card -->
                    <label class="block cursor-pointer">
                        <input type="radio" name="payment_method" value="credit_card" x-model="method" class="sr-only">
                        <div class="payment-card flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 transition-all">
                            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                                </svg>
                            </div>
                            <div class="flex-1">
                                <p class="font-medium text-gray-900">Cartão de Crédito</p>
                                <p class="text-sm text-gray-500">Parcele em até 12x</p>
                            </div>
                            <div class="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                <div class="w-2.5 h-2.5 rounded-full bg-transparent"></div>
                            </div>
                        </div>
                    </label>
                </div>

                <!-- Card Form -->
                <div x-show="method === 'credit_card'" x-cloak class="mt-5 pt-5 border-t border-gray-100">
                    <form method="POST" action="<?php echo e(route('checkout.process', $transaction->uuid)); ?>" id="card-form">
                        <?php echo csrf_field(); ?>
                        <input type="hidden" name="payment_method" value="credit_card">
                        
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Número do Cartão</label>
                                <input type="text" name="card_number" required maxlength="19" placeholder="0000 0000 0000 0000"
                                       class="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                                <input type="text" name="card_holder_name" required placeholder="NOME COMO ESTÁ NO CARTÃO"
                                       class="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 uppercase">
                            </div>
                            
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Validade</label>
                                    <input type="text" name="card_expiry" required maxlength="5" placeholder="MM/AA"
                                           class="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                    <input type="text" name="card_cvv" required maxlength="4" placeholder="123"
                                           class="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900">
                                </div>
                            </div>

                            <?php if($installments > 1): ?>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Parcelas</label>
                                <input type="hidden" name="installments" value="<?php echo e($installments); ?>">
                                <p class="text-gray-900 font-medium"><?php echo e($installments); ?>x de R$ <?php echo e(number_format($transaction->amount / $installments, 2, ',', '.')); ?></p>
                            </div>
                            <?php endif; ?>
                        </div>

                        <button type="submit" class="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                            </svg>
                            Pagar R$ <?php echo e(number_format($transaction->amount, 2, ',', '.')); ?>

                        </button>
                    </form>
                </div>

                <!-- PIX Form -->
                <div x-show="method === 'pix'" x-cloak class="mt-5 pt-5 border-t border-gray-100">
                    <?php if($transaction->pix_qr_code ?? false): ?>
                        <div class="text-center">
                            <div class="bg-white border-2 border-gray-100 rounded-xl p-4 inline-block mb-4">
                                <img src="data:image/png;base64,<?php echo e($transaction->pix_qr_code_image ?? ''); ?>" alt="QR Code PIX" class="w-48 h-48 mx-auto">
                            </div>
                            <p class="text-sm text-gray-500 mb-2">Escaneie o QR Code ou copie o código abaixo</p>
                            <div class="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-3">
                                <code class="text-xs break-all text-gray-700 select-all"><?php echo e($transaction->pix_copy_paste ?? ''); ?></code>
                            </div>
                            <button onclick="navigator.clipboard.writeText('<?php echo e($transaction->pix_copy_paste ?? ''); ?>')" class="text-blue-600 hover:text-blue-800 font-medium text-sm">
                                Copiar código PIX
                            </button>
                        </div>
                    <?php else: ?>
                        <form method="POST" action="<?php echo e(route('checkout.process', $transaction->uuid)); ?>">
                            <?php echo csrf_field(); ?>
                            <input type="hidden" name="payment_method" value="pix">
                            <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-colors">
                                Gerar QR Code PIX
                            </button>
                        </form>
                    <?php endif; ?>
                </div>

                <!-- Boleto Form -->
                <div x-show="method === 'boleto'" x-cloak class="mt-5 pt-5 border-t border-gray-100">
                    <?php if($transaction->boleto_url ?? false): ?>
                        <div class="text-center">
                            <a href="<?php echo e($transaction->boleto_url); ?>" target="_blank" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-colors inline-flex items-center justify-center gap-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                                Visualizar Boleto
                            </a>
                            <?php if($transaction->boleto_expiration): ?>
                                <p class="text-sm text-gray-500 mt-3">Vencimento: <?php echo e($transaction->boleto_expiration); ?></p>
                            <?php endif; ?>
                        </div>
                    <?php else: ?>
                        <form method="POST" action="<?php echo e(route('checkout.process', $transaction->uuid)); ?>">
                            <?php echo csrf_field(); ?>
                            <input type="hidden" name="payment_method" value="boleto">
                            <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-colors">
                                Gerar Boleto
                            </button>
                        </form>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Security Note -->
            <div class="flex items-center justify-center gap-2 text-gray-500 text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <span>Pagamento 100% seguro</span>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 py-4">
        <div class="max-w-md mx-auto px-4 text-center">
            <p class="text-sm text-gray-500">Powered by</p>
            <p class="text-lg font-bold text-gray-800">asaas</p>
        </div>
    </footer>

    <script>
        document.querySelectorAll('input[name="payment_method"]').forEach(radio => {
            radio.addEventListener('change', function() {
                document.querySelectorAll('.payment-card').forEach(card => {
                    card.classList.remove('active', 'border-blue-600', 'bg-blue-50');
                    card.querySelector('.bg-gray-300')?.classList.replace('bg-gray-300', 'bg-transparent');
                });
                if (this.checked) {
                    this.closest('.payment-card').classList.add('active', 'border-blue-600', 'bg-blue-50');
                    this.closest('.payment-card').querySelector('.border-gray-300').classList.replace('border-gray-300', 'border-blue-600');
                    this.closest('.payment-card').querySelector('.bg-transparent')?.classList.replace('bg-transparent', 'bg-blue-600');
                }
            });
        });

        // Initialize first selected
        document.querySelector('input[name="payment_method"]:checked')?.closest('.payment-card')?.classList.add('active', 'border-blue-600', 'bg-blue-50');
    </script>
</body>
</html>
<?php /**PATH /Users/viniciusreinehr/.gemini/antigravity/scratch/Checkout/resources/views/checkout/index.blade.php ENDPATH**/ ?>