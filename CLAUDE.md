# CLAUDE.md — aws-zukan 開発ルール

AWS のサービスを「部品表＋設計判断集」として引ける図鑑アプリ。
このファイルは作業時に必ず守るルールをまとめる。

---

## 1. ブランチ・PR

- 作業前に Issue を作成し、番号をブランチ名に含める（例: `feature/#12-service-detail`）。
- `main` への直接 push は禁止。必ず PR 経由。
- コミットメッセージは Conventional Commits 形式・日本語（`feat:` `fix:` `docs:` `chore:` 等）。

## 2. ドキュメントの扱い

- 作業中の下書き・個人メモは `*.local.md` に置く。これらは `.gitignore` 済みで**公開リポに出さない**。
- 公開する `docs/*.md` と `data/*.json` は、**普通の一般的な言葉**で書く。社内・独自の言い回しを持ち込まない。
- 用語・命名のチェックは `scripts/docs-lint.sh` が pre-commit と CI（`.github/workflows/docs-lint.yml`）で自動実行する。
  - 初回のみ `bash scripts/install-hooks.sh` でフックを導入する。

## 3. データ記入の原則（図鑑の品質）

- **本文・公式を読んでから書く**。題名や記憶だけで書かない。
- 体験ベースの記述（`realWorldNotes` 等）は**出典 URL 必須**。
- 確認できない欄は**空のまま**にする（未確認を可視化）。埋めるための創作はしない。
- 「正解／不正解」と断定せず、「標準推奨構成／不適合になりやすい構成」（前提条件つき）で書く。
- 料金は具体額を持たず、定性表現＋公式ページへの送客にとどめる。

## 4. 安全

- 破壊的な AWS / git 操作（削除・force push 等）は人の承認を挟む。AI 単独で完結させない。
- `.env` や認証情報をコミットしない。

---

## ディレクトリ

```
aws-zukan/
├── docs/    設計ドキュメント（公開）／作業用は *.local.md（非公開）
├── data/    services.json / patterns.json / common-rules.json
└── scripts/ docs-lint.sh（用語チェック）／ install-hooks.sh
```
