#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# git-secrets — Pre-commit Hook Setup
# ═══════════════════════════════════════════════════════════════════════════════
# Instala hooks que bloqueiam commits com secrets, credenciais,
# chaves privadas, ou arquivos sensíveis.
#
# Uso: bash scripts/git-secrets.sh
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

echo "=== Configurando git hooks de segurança ==="

GIT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
if [ -z "$GIT_ROOT" ]; then
    echo "❌ Não está em um repositório git."
    exit 1
fi

HOOKS_DIR="$GIT_ROOT/.githooks"
INSTALL_DIR="$GIT_ROOT/.git/hooks"

mkdir -p "$HOOKS_DIR"

# ── Pre-commit hook ──
cat > "$HOOKS_DIR/pre-commit" << 'PREHOOK'
#!/bin/bash
set -euo pipefail

echo "🔍 [git-secrets] Scanning for secrets in staged files..."

STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

if [ -z "$STAGED_FILES" ]; then
    exit 0
fi

# Patterns to block
BLOCKED_PATTERNS=(
    'AKIA[0-9A-Z]{16}'                    # AWS Access Key
    '-----BEGIN\s?(RSA|DSA|EC|PGP|OPENSSH)\s?PRIVATE KEY-----'
    'ghp_[0-9a-zA-Z]{36}'                 # GitHub PAT
    'gho_[0-9a-zA-Z]{36}'                 # GitHub OAuth
    'xox[baprs]-[0-9a-zA-Z]{10,}'        # Slack token
    'sk-[0-9a-zA-Z]{32,}'                 # OpenAI key
    'SG\.[0-9a-zA-Z-_]{22}\.[0-9a-zA-Z-_]{43}' # SendGrid
    'pk\.[0-9a-zA-Z]{24}'                 # Stripe publishable
    'sk\.[0-9a-zA-Z]{24}'                 # Stripe secret
    'MASTER_SEED_HEX=[a-f0-9]{64}'        # Basileia master seed
    'MASTER_TOTP_SEED=[A-Z0-9]{,}'        # Basileia TOTP seed
    'SECURITY_ENCRYPTION_KEY='            # Basileia KEK
    'password\s*=\s*['"'"'"]?[^'"'"'"'\s]{8,}'   # password = value
)

HAS_ERROR=0

for file in $STAGED_FILES; do
    if [ ! -f "$file" ]; then
        continue
    fi

    for pattern in "${BLOCKED_PATTERNS[@]}"; do
        if grep -Pq "$pattern" "$file" 2>/dev/null; then
            echo "   ⚠️  Blocked pattern found in: $file"
            echo "      Pattern: ${pattern:0:40}..."
            HAS_ERROR=1
        fi
    done
done

# Block .env files
for file in $STAGED_FILES; do
    if [[ "$file" == *.env ]] && [[ "$file" != ".env.example" ]]; then
        echo "   ⚠️  Blocked: $file (.env files should not be committed)"
        HAS_ERROR=1
    fi
done

if [ "$HAS_ERROR" -eq 1 ]; then
    echo "❌ [git-secrets] Commit bloqueado. Remova os secrets antes de commitar."
    echo "   Use: git unstage <file> && git restore <file>"
    exit 1
fi

echo "✅ [git-secrets] Scan OK — no secrets found."
PREHOOK

chmod +x "$HOOKS_DIR/pre-commit"

# ── Install symlink ──
ln -sf "../../.githooks/pre-commit" "$INSTALL_DIR/pre-commit"
echo "✅ Hook installed: $INSTALL_DIR/pre-commit -> .githooks/pre-commit"

echo ""
echo "=== Resumo ==="
echo "  Hook:      pre-commit"
echo "  Local:     $HOOKS_DIR/pre-commit"
echo "  Instalado: $INSTALL_DIR/pre-commit"
echo ""
echo "Para testar manualmente: bash .githooks/pre-commit"
echo "Para pular o hook (emergência): git commit --no-verify"
