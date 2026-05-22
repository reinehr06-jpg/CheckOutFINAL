<?php

namespace App\Notifications;

use App\Models\JitAccessRequest;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class JitApprovalNotification extends Notification
{
    public JitAccessRequest $request;

    public function __construct(JitAccessRequest $request)
    {
        $this->request = $request;
    }

    public function via($notifiable): array
    {
        $channels = ['mail'];

        if (!empty(config('services.slack.webhook_url'))) {
            $channels[] = 'slack';
        }

        return $channels;
    }

    public function toMail($notifiable): MailMessage
    {
        $status = $this->request->status;
        $isApproval = $status === 'approved';

        return (new MailMessage)
            ->subject($isApproval
                ? '✅ Acesso JIT aprovado — Basileia Pay'
                : '🔐 Solicitação de acesso JIT — Basileia Pay')
            ->greeting($isApproval
                ? "Acesso aprovado para {$this->request->requester->name}"
                : "{$this->request->requester->name} solicitou elevação de privilégio")
            ->line("Alvo: {$this->request->target_role}")
            ->line("Motivo: {$this->request->reason}")
            ->when($isApproval, function ($msg) {
                $msg->line("Válido até: {$this->request->expires_at->format('d/m/Y H:i')}");
                $msg->line("Aprovado por: {$this->request->approver->name}");
            })
            ->when(!$isApproval, function ($msg) {
                $msg->action('Revisar solicitação', url('/admin/jit'));
            })
            ->line('Sistema de controle de acesso — Basileia Pay');
    }

    public function toSlack($notifiable): array
    {
        $requesterName = $this->request->requester->name ?? 'Unknown';

        return [
            'attachments' => [
                [
                    'color' => $this->request->status === 'approved' ? 'good' : 'warning',
                    'title' => $this->request->status === 'approved'
                        ? '✅ JIT Access Approved'
                        : '🔐 JIT Access Requested',
                    'fields' => [
                        ['title' => 'Requester', 'value' => $requesterName, 'short' => true],
                        ['title' => 'Target Role', 'value' => $this->request->target_role, 'short' => true],
                        ['title' => 'Reason', 'value' => $this->request->reason, 'short' => false],
                    ],
                    'ts' => now()->timestamp,
                ],
            ],
        ];
    }
}
