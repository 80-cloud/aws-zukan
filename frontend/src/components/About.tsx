import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      <div className="mt-2 text-sm leading-relaxed text-gray-700">{children}</div>
    </section>
  )
}

export default function About() {
  return (
    <article className="max-w-2xl">
      <h1 className="text-2xl font-bold">このアプリの設計思想</h1>
      <p className="mt-2 text-sm text-gray-600">AWS を「部品表」だけでなく「設計判断集」として引けるようにした図鑑です。なぜこの作りにしたかをまとめます。</p>
      <Block title="解きたい課題">
        公式ドキュメントは各サービスの機能には詳しい一方、「この要件にどの構成が妥当か」「何を見落とすと事故るか」は横断的に引きにくい。その結果「動くが本番に足りない構成」を作りがちです。サービス単体ではなく構成と横断ルールまでを一つの図鑑にまとめました。
      </Block>
      <Block title="設計の柱">
        <ul className="list-disc space-y-1 pl-5">
          <li>2 層 ＋ 横断ルール：サービス図鑑（部品表）／構成パターン図鑑（設計判断集）／共通ルール（重複記述しない正規化）。</li>
          <li>断定しない：「正解／不正解」ではなく「標準推奨構成／不適合になりやすい構成」を前提条件つきで示す。</li>
          <li>8 軸評価：Well-Architected の 6 本柱＋独自 3 軸（統制適合・移行容易・ベンダー依存）を ◎○△ で。</li>
          <li>創作しない：本文・公式を読んでから書き、体験ベースの記述は出典必須。確認できない欄は空にして未確認を可視化。</li>
          <li>派生ビューはルールベース：設計レビュー観点・セキュリティ注意・隠れコスト・事例検索は既存データから機械的に組み立て、生成 AI の作文に依存しない。</li>
        </ul>
      </Block>
      <Block title="拡張に強い構造">
        サービスや構成は JSON に追加するだけで一覧・検索・比較に反映され、表示側のコードは書き換え不要です。データ読み込みを <code className="rounded bg-gray-100 px-1">src/api/</code> のリポジトリ層に隔離しているため、将来 JSON からバックエンドへ載せ替えても画面は無改修。30 件から 300 件規模まで破綻しない構造を狙っています。
      </Block>
      <Block title="品質への取り組み">
        <ul className="list-disc space-y-1 pl-5">
          <li>参照（サービス id 等）は実在チェックして壊れたリンクを出さない。</li>
          <li>コミット前と CI で用語・命名チェックを自動実行。</li>
          <li>GitHub Pages へ push のたび自動デプロイ。</li>
        </ul>
      </Block>
      <Block title="今後">
        現在は閲覧専用・ローカル完結（JSON ＋ ブラウザ内保存）。データ層を隔離してあるため、将来はバックエンド（API ＋ データベース）へ無理なく移せる構造にしています。
      </Block>
      <p className="mt-8 text-sm"><Link to="/" className="text-blue-600 hover:underline">← サービス一覧へ</Link></p>
    </article>
  )
}
