import { zukanRepository } from './api/zukanRepository'
export default function App() {
  const list = zukanRepository.listServices()
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-bold">AWS 図鑑</h1>
      <p className="mt-1 text-sm text-gray-500">サービス {list.length} 件</p>
      <ul className="mt-6 space-y-3">
        {list.map(s => (
          <li key={s.id} className="rounded-lg border p-4">
            <b>{s.name}</b> <span className="text-xs text-gray-400">{s.category} / Tier {s.tier}</span>
            <p className="mt-1 text-sm text-gray-700">{s.oneLiner}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
