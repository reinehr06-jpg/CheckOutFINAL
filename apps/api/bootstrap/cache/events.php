<?php return array (
  'Illuminate\\Foundation\\Support\\Providers\\EventServiceProvider' => 
  array (
    'App\\Events\\PaymentRefunded' => 
    array (
      0 => 'App\\Listeners\\DispatchWebhookOnPaymentRefunded@handle',
    ),
    'App\\Events\\PaymentApproved' => 
    array (
      0 => 'App\\Listeners\\DispatchWebhookOnPaymentApproved@handle',
      1 => 'App\\Listeners\\UpdateTransactionOnPaymentApproved@handle',
    ),
    'App\\Events\\PaymentOverdue' => 
    array (
      0 => 'App\\Listeners\\DispatchWebhookOnPaymentOverdue@handle',
    ),
    'App\\Events\\PaymentRefused' => 
    array (
      0 => 'App\\Listeners\\DispatchWebhookOnPaymentRefused@handle',
    ),
  ),
);