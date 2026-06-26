#!/usr/bin/env bash
set -eo pipefail
REPO_ROOT=$(git rev-parse --show-toplevel)
HOOK="$REPO_ROOT/.git/hooks/pre-commit"
mkdir -p "$REPO_ROOT/.git/hooks"
cat > "$HOOK" <<'EOF'
#!/usr/bin/env bash
set -e
R=$(git rev-parse --show-toplevel)
if [ -x "$R/scripts/docs-lint.sh" ]; then
  bash "$R/scripts/docs-lint.sh" --staged
else
  echo "⚠ docs-lint.sh が無い・スキップ"
fi
EOF
chmod +x "$HOOK" "$REPO_ROOT/scripts/docs-lint.sh"
echo "✓ pre-commit hook 導入: $HOOK"
