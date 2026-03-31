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
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    },
                },
            },
        }
    </script>
</head>
<body class="bg-gray-50 min-h-screen font-sans">
    <div class="max-w-md mx-auto bg-white min-h-screen" 
         x-data="{ 
             method: '<?php echo e($paymentMethod); ?>' || 'pix',
             locale: 'pt-BR',
             currency: 'BRL',
             country: 'Brasil',
             termsAccepted: false,
             countries: {
                 'Brasil': { locale: 'pt-BR', currency: 'BRL', symbol: 'R$' },
                 'United States': { locale: 'en-US', currency: 'USD', symbol: '$' },
                 'España': { locale: 'es-ES', currency: 'EUR', symbol: '€' },
                 'Portugal': { locale: 'pt-PT', currency: 'EUR', symbol: '€' }
             },
             translations: {
                 'pt-BR': { summary: 'Resumo do Pedido', total: 'Total', paymentMethod: 'Forma de Pagamento', cardNumber: 'Número do Cartão', fullName: 'Nome Completo', expiry: 'Validade', pay: 'Pagar', terms: 'Aceito os termos de serviço', poweredBy: 'Powered by' },
                 'en-US': { summary: 'Order Summary', total: 'Total', paymentMethod: 'Payment Method', cardNumber: 'Card Number', fullName: 'Full Name', expiry: 'Expiry', pay: 'Pay', terms: 'I accept the terms of service', poweredBy: 'Powered by' },
                 'es-ES': { summary: 'Resumen del Pedido', total: 'Total', paymentMethod: 'Forma de Pago', cardNumber: 'Número de Tarjeta', fullName: 'Nombre Completo', expiry: 'Vencimiento', pay: 'Pagar', terms: 'Acepto los términos de servicio', poweredBy: 'Desarrollado por' },
                 'pt-PT': { summary: 'Resumo do Pedido', total: 'Total', paymentMethod: 'Método de Pagamento', cardNumber: 'Número do Cartão', fullName: 'Nome Completo', expiry: 'Validade', pay: 'Pagar', terms: 'Aceito os termos de serviço', poweredBy: 'Desenvolvido por' }
             },
             t(key) { return this.translations[this.locale]?.[key] || key; },
             formatCurrency(amount) {
                 const symbol = this.countries[this.country]?.symbol || 'R$';
                 return symbol + ' ' + amount.toFixed(2).replace('.', ',');
             },
             updateCountry() {
                 const c = this.countries[this.country];
                 this.locale = c.locale;
                 this.currency = c.currency;
             }
         }">
        
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-100">
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                    <span class="text-white font-bold text-sm">B</span>
                </div>
                <div>
                    <h1 class="text-lg font-bold text-gray-900">Basiléia</h1>
                    <p class="text-xs text-gray-500 -mt-1">Portal de Payments</p>
                </div>
            </div>
            <div>
                <select x-model="country" @change="updateCountry()" 
                        class="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <template x-for="c in Object.keys(countries)" :key="c">
                        <option :value="c" x-text="c" :selected="c === country"></option>
                    </template>
                </select>
            </div>
        </div>

        <!-- Resumo do Pedido -->
        <div class="px-4 pt-4">
            <div class="bg-gray-50 rounded-lg p-4">
                <h2 class="text-sm font-semibold text-gray-900 mb-3" x-text="t('summary')"></h2>
                <div class="flex justify-between items-start">
                    <div>
                        <p class="font-medium text-gray-900"><?php echo e($transaction->description ?? 'Plano Premium Annual'); ?></p>
                        <p class="text-sm text-gray-500"><?php echo e($transaction->customer_name ?? 'igreja Teste'); ?></p>
                    </div>
                </div>
                <div class="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                    <span class="text-sm font-medium text-gray-700" x-text="t('total')"></span>
                    <span class="text-xl font-bold text-gray-900" x-text="formatCurrency(<?php echo e($transaction->amount); ?>)"></span>
                </div>
            </div>
        </div>

        <!-- Forma de Pagamento -->
        <div class="px-4 pt-4">
            <h2 class="text-sm font-semibold text-gray-900 mb-3" x-text="t('paymentMethod')"></h2>
            <div class="space-y-2">
                <!-- PIX -->
                <label class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                    <input type="radio" name="method" value="pix" x-model="method" class="w-4 h-4 text-blue-600">
                    <span class="text-sm font-medium text-gray-900">PIX</span>
                </label>

                <!-- Boleto -->
                <label class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                    <input type="radio" name="method" value="boleto" x-model="method" class="w-4 h-4 text-blue-600">
                    <span class="text-sm font-medium text-gray-900">Boleto Bancário</span>
                </label>

                <!-- Cartão de Crédito -->
                <label class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                    <input type="radio" name="method" value="credit_card" x-model="method" class="w-4 h-4 text-blue-600">
                    <span class="text-sm font-medium text-gray-900">Cartão de Crédito</span>
                </label>
            </div>
        </div>

        <!-- Credit Card Form -->
        <div x-show="method === 'credit_card'" x-cloak class="px-4 pt-4">
            <form method="POST" action="<?php echo e(route('checkout.process', $transaction->uuid)); ?>">
                <?php echo csrf_field(); ?>
                <input type="hidden" name="payment_method" value="credit_card">
                
                <div class="space-y-3">
                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1" x-text="t('cardNumber')"></label>
                        <input type="text" name="card_number" required maxlength="19" placeholder="0000 0000 0000 0000"
                               class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1" x-text="t('fullName')"></label>
                        <input type="text" name="card_holder_name" required placeholder="NOME COMO ESTÁ NO CARTÃO"
                               class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white text-gray-900 placeholder-gray-400 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1" x-text="t('expiry') + ' (MM/AA)'"></label>
                            <input type="text" name="card_expiry" required maxlength="5" placeholder="MM/AA"
                                   class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">CVV</label>
                            <input type="text" name="card_cvv" required maxlength="4" placeholder="123"
                                   class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                    </div>
                    <div class="flex items-start gap-2 pt-1">
                        <input type="checkbox" x-model="termsAccepted" id="terms" class="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                        <label for="terms" class="text-xs text-gray-600" x-text="t('terms')"></label>
                    </div>
                </div>

                <button type="submit" 
                        class="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    <span x-text="t('pay') + ' ' + formatCurrency(<?php echo e($transaction->amount); ?>)"></span>
                </button>
            </form>
        </div>

        <!-- PIX Content -->
        <div x-show="method === 'pix'" x-cloak class="px-4 pt-4">
            <?php if($transaction->pix_qr_code ?? false): ?>
                <div class="bg-gray-50 rounded-lg p-4 text-center">
                    <div class="bg-white border border-gray-200 rounded-lg p-3 inline-block mb-3">
                        <img src="data:image/png;base64,<?php echo e($transaction->pix_qr_code_image ?? ''); ?>" alt="QR Code PIX" class="w-44 h-44 mx-auto">
                    </div>
                    <p class="text-xs text-gray-500 mb-2">Escaneie o QR Code ou copie o código abaixo</p>
                    <div class="bg-white border border-gray-200 rounded-lg p-3 mb-3">
                        <code class="text-xs break-all text-gray-600 select-all"><?php echo e($transaction->pix_copy_paste ?? ''); ?></code>
                    </div>
                    <button onclick="navigator.clipboard.writeText('<?php echo e($transaction->pix_copy_paste ?? ''); ?>')" 
                            class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        Copiar código
                    </button>
                </div>
            <?php else: ?>
                <form method="POST" action="<?php echo e(route('checkout.process', $transaction->uuid)); ?>">
                    <?php echo csrf_field(); ?>
                    <input type="hidden" name="payment_method" value="pix">
                    <button type="submit" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
                        Gerar QR Code PIX
                    </button>
                </form>
            <?php endif; ?>
        </div>

        <!-- Boleto Content -->
        <div x-show="method === 'boleto'" x-cloak class="px-4 pt-4">
            <?php if($transaction->boleto_url ?? false): ?>
                <div class="bg-gray-50 rounded-lg p-4 text-center">
                    <a href="<?php echo e($transaction->boleto_url); ?>" target="_blank" 
                       class="inline-flex items-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        Visualizar Boleto
                    </a>
                    <?php if($transaction->boleto_expiration): ?>
                        <p class="text-xs text-gray-500 mt-3">Vencimento: <?php echo e($transaction->boleto_expiration); ?></p>
                    <?php endif; ?>
                </div>
            <?php else: ?>
                <form method="POST" action="<?php echo e(route('checkout.process', $transaction->uuid)); ?>">
                    <?php echo csrf_field(); ?>
                    <input type="hidden" name="payment_method" value="boleto">
                    <button type="submit" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
                        Gerar Boleto
                    </button>
                </form>
            <?php endif; ?>
        </div>

        <!-- Footer -->
        <div class="px-4 py-6 mt-6 border-t border-gray-100 text-center">
            <p class="text-xs text-gray-400" x-text="t('poweredBy')"></p>
            <p class="text-sm font-bold text-gray-600 mt-0.5">asaas</p>
        </div>
    </div>
</body>
</html>
<?php /**PATH /Users/viniciusreinehr/.gemini/antigravity/scratch/Checkout/resources/views/checkout/index.blade.php ENDPATH**/ ?>