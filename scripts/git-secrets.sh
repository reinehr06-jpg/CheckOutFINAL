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

echo "  [git-secrets] Scanning for secrets in staged files..."

STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

if [ -z "$STAGED_FILES" ]; then
    exit 0
fi

HAS_ERROR=0

for file in $STAGED_FILES; do
    if [ ! -f "$file" ]; then
        continue
    fi

    # Skip the hook itself
    if [ "$file" = ".githooks/pre-commit" ] || [ "$file" = "scripts/git-secrets.sh" ]; then
        continue
    fi

    # Skip example files
    if [ "$file" = ".env.example" ]; then
        continue
    fi

    # Check for .env files (except .env.example)
    if [[ "$file" == *.env ]] && [[ "$file" != ".env.example" ]]; then
        echo "   Blocked: $file (.env files should not be committed)"
        HAS_ERROR=1
        continue
    fi

    # Check for private keys
    if grep -Pq '-----BEGIN\s?(RSA|DSA|EC|PGP|OPENSSH)\s?PRIVATE KEY-----' "$file" 2>/dev/null; then
        echo "   Blocked: private key in $file"
        HAS_ERROR=1
    fi

    # Check for AWS keys
    if grep -Pq 'AKIA[0-9A-Z]{16}' "$file" 2>/dev/null; then
        echo "   Blocked: AWS access key in $file"
        HAS_ERROR=1
    fi

    # Check for GitHub tokens
    if grep -Pq 'gh[pousr]_[0-9a-zA-Z]{36}' "$file" 2>/dev/null; then
        echo "   Blocked: GitHub token in $file"
        HAS_ERROR=1
    fi

    # Check for Basileia master seeds
    if grep -Eq '(MASTER_SEED_HEX|MASTER_TOTP_SEED|SECURITY_ENCRYPTION_KEY)=[^=[:space:]]{10,}' "$file" 2>/dev/null; then
        echo "   Blocked: Basileia master seed/key in $file"
        HAS_ERROR=1
    fi
done

if [ "$HAS_ERROR" -eq 1 ]; then
    echo "  [git-secrets] Commit blocked. Remove secrets before committing."
    exit 1
fi

echo "  [git-secrets] OK"
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
