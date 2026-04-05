<?php

namespace App\Services\Gateway;

use Exception;

class GatewayFactory
{
    private const GATEWAYS = [
        'asaas' => AsaasGateway::class,
        'stripe' => StripeGateway::class,
        'pagseguro' => PagSeguroGateway::class,
        'paypal' => PayPalGateway::class,
        'adyen' => AdyenGateway::class,
        'braintree' => BraintreeGateway::class,
        'square' => SquareGateway::class,
        'authorizenet' => AuthorizeNetGateway::class,
        'verifone' => VerifoneGateway::class,
        'checkoutcom' => CheckoutComGateway::class,
        'klarna' => KlarnaGateway::class,
        'worldpay' => WorldpayGateway::class,
        'mercadopago' => MercadoPagoGateway::class,
        'mollie' => MollieGateway::class,
        'razorpay' => RazorpayGateway::class,
        'airwallex' => AirwallexGateway::class,
        'payoneer' => PayoneerGateway::class,
        'skrill' => SkrillGateway::class,
        'rapyd' => RapydGateway::class,
        'flutterwave' => FlutterwaveGateway::class,
        'bluesnap' => BlueSnapGateway::class,
        'custom' => CustomGateway::class,
    ];

    public function make(string $type): GatewayInterface
    {
        $type = strtolower($type);

        if (!isset(self::GATEWAYS[$type])) {
            throw new Exception("Gateway type '{$type}' not supported.");
        }

        $class = self::GATEWAYS[$type];
        return new $class();
    }

    public static function getAvailableGateways(): array
    {
        return array_keys(self::GATEWAYS);
    }
}
