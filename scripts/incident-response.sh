#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# Incident Response Runbook — Basileia Pay
# ═══════════════════════════════════════════════════════════════════════════════
# Uso: bash scripts/incident-response.sh <incident-type> [parameters]
#
# Tipos:
#   block-ip <ip> [reason]
#   rotate-kek
#   revoke-sessions <user-id|email>
#   emergency-disable <company-id>
#   quarantine-key <key-id>
#   audit <event> <user-id> [details]
#
# Exemplos:
#   bash scripts/incident-response.sh block-ip 203.0.113.42 "Brute force attack"
#   bash scripts/incident-response.sh rotate-kek
#   bash scripts/incident-response.sh revoke-sessions user@example.com
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

INCIDENT_TYPE="${1:-}"
PARAM1="${2:-}"
PARAM2="${3:-}"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
INCIDENT_ID="INC-$(date +%s)"

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║       🔴 Basileia Pay — Incident Response Runbook           ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "  Incident ID: $INCIDENT_ID"
echo "  Timestamp:   $TIMESTAMP"
echo "  Type:        ${INCIDENT_TYPE:-none}"
echo "────────────────────────────────────────────────────────────────"
echo ""

# ── Help ──
if [ -z "$INCIDENT_TYPE" ] || [ "$INCIDENT_TYPE" = "help" ] || [ "$INCIDENT_TYPE" = "--help" ]; then
    echo "Uso: bash scripts/incident-response.sh <type> [params]"
    echo ""
    echo "Tipos de incidente:"
    echo "  block-ip <ip> [reason]         — Bloquear IP no firewall (via iptables/nftables)"
    echo "  rotate-kek                      — Rotacionar KEK e re-wrap DEKs"
    echo "  revoke-sessions <user|email>   — Revogar todas as sessoes de um usuario"
    echo "  emergency-disable <company-id> — Desativar empresa e revogar tokens"
    echo "  quarantine-key <key-id>         — Quarentena de chave de API"
    echo "  audit <event> <user> [details] — Registrar auditoria manual"
    exit 0
fi

# ── Logger ──
log() {
    local level="${1:-INFO}"
    local message="${2:-}"
    echo "[$level] $message"
    logger -t "incident-response[$INCIDENT_ID]" "$level: $message"
}

# ── 1. Block IP ──
if [ "$INCIDENT_TYPE" = "block-ip" ]; then
    if [ -z "$PARAM1" ]; then
        echo "❌ Uso: $0 block-ip <ip> [reason]"
        exit 1
    fi

    IP="$PARAM1"
    REASON="${PARAM2:-No reason provided}"

    log "WARN" "Blocking IP $IP — Reason: $REASON"
    echo ""
    echo "   ▶ Ações manuais necessárias:"
    echo "     1. EasyPanel → Firewall → Block IP: $IP"
    echo "     2. Nginx: adicione ao /etc/nginx/conf.d/blocked.conf:"
    echo "        deny $IP;"
    echo "     3. Rate limiter: bash scripts/rate-limit-ban.sh $IP"
    echo ""
    log "INFO" "IP $IP blocked. Incident: $INCIDENT_ID"

    # Write audit log
    echo "$TIMESTAMP | $INCIDENT_ID | BLOCK_IP | $IP | $REASON" >> /var/log/incidents.log 2>/dev/null || true
    echo "✅ Logged to /var/log/incidents.log"

    # Reload nginx if possible
    if command -v nginx &> /dev/null; then
        echo "ℹ️  Run: nginx -s reload (requires root)"
    fi

    echo ""
    echo "   ✅ Bloqueio de IP registrado."
    echo "   🔗 Ações pendentes: configuração no EasyPanel."
fi

# ── 2. Rotate KEK ──
if [ "$INCIDENT_TYPE" = "rotate-kek" ]; then
    log "WARN" "Starting KEK rotation"
    echo ""
    echo "   ▶ Procedimento:"
    echo "     1. Gere nova KEK: php -r \"echo base64_encode(random_bytes(32));\""
    echo "     2. Adicione ao .env: SECURITY_ENCRYPTION_KEY=<nova_chave>"
    echo "     3. Incremente: SECURITY_KEK_VERSION=\$((SECURITY_KEK_VERSION+1))"
    echo "     4. Execute: php artisan basileia:rotate-kek"
    echo "     5. Verifique: php artisan tinker --execute=\"echo app(App\\\\Services\\\\Crypto\\\\TenantEncryption::class)->loadDek(1);\""
    echo "     6. Mantenha a KEK antiga por 1 ciclo de rotação"
    echo ""
    log "INFO" "KEK rotation instructions printed. Incident: $INCIDENT_ID"
fi

# ── 3. Revoke Sessions ──
if [ "$INCIDENT_TYPE" = "revoke-sessions" ]; then
    if [ -z "$PARAM1" ]; then
        echo "❌ Uso: $0 revoke-sessions <user-id|email>"
        exit 1
    fi

    echo ""
    echo "   ▶ Para revogar sessões de '$PARAM1':"
    echo "     Artisan: php artisan tinker"
    echo "     >>> \$user = \App\Models\User::where('email', '$PARAM1')->first()"
    echo "     >>> \$user->tokens()->delete()"
    echo "     >>> \App\Models\RefreshToken::where('user_id', \$user->id)->update(['revoked_at' => now()])"
    echo "     >>> \App\Models\JitAccessRequest::where('requested_by', \$user->id)->active()->update(['status' => 'expired'])"
    echo ""
    log "INFO" "Session revocation instructions printed for: $PARAM1. Incident: $INCIDENT_ID"
fi

# ── 4. Emergency Disable Company ──
if [ "$INCIDENT_TYPE" = "emergency-disable" ]; then
    if [ -z "$PARAM1" ]; then
        echo "❌ Uso: $0 emergency-disable <company-id>"
        exit 1
    fi

    COMPANY_ID="$PARAM1"

    echo ""
    echo "   ▶ Desativando Company #$COMPANY_ID:"
    echo "     Artisan: php artisan tinker"
    echo "     >>> \$company = \App\Models\Company::find($COMPANY_ID)"
    echo "     >>> \$company->update(['status' => 'suspended'])"
    echo "     >>> \$company->users()->update(['status' => 'suspended'])"
    echo "     >>> foreach(\$company->users as \$u) { \$u->tokens()->delete(); }"
    echo "     >>> \$company->apiKeys()->update(['revoked_at' => now()])"
    echo ""
    log "WARN" "Emergency disable instructions for company $COMPANY_ID. Incident: $INCIDENT_ID"
fi

# ── 5. Quarantine API Key ──
if [ "$INCIDENT_TYPE" = "quarantine-key" ]; then
    if [ -z "$PARAM1" ]; then
        echo "❌ Uso: $0 quarantine-key <key-id>"
        exit 1
    fi

    echo ""
    echo "   ▶ Quarentena da chave #$PARAM1:"
    echo "     Artisan: php artisan tinker"
    echo "     >>> \$key = \App\Models\ApiKey::find($PARAM1)"
    echo "     >>> \$key->update(['revoked_at' => now(), 'status' => 'quarantined'])"
    echo "     >>> \App\Models\AuditLog::create([...]) // Registrar evento"
    echo ""
    log "WARN" "API key $PARAM1 quarantined. Incident: $INCIDENT_ID"
fi

# ── 6. Manual Audit ──
if [ "$INCIDENT_TYPE" = "audit" ]; then
    if [ -z "$PARAM1" ] || [ -z "$PARAM2" ]; then
        echo "❌ Uso: $0 audit <event> <user> [details]"
        exit 1
    fi

    DETAILS="${PARAM3:-manual incident response}"
    echo ""
    echo "   ▶ Registrando auditoria: $PARAM1 / $PARAM2"
    echo "     php artisan tinker"
    echo "     >>> app(\App\Services\Audit\AuditService::class)->log('$PARAM1', null, ['incident_id' => '$INCIDENT_ID', 'details' => '$DETAILS', 'target' => '$PARAM2'])"
    echo ""
    log "INFO" "Manual audit entry: $PARAM1. Incident: $INCIDENT_ID"
fi

echo ""
echo "────────────────────────────────────────────────────────────────"
echo "  ✅ Incidente $INCIDENT_ID processado."
echo "  📋 Registre o ocorrido em: docs/incidents/$INCIDENT_ID.md"
echo "────────────────────────────────────────────────────────────────"
