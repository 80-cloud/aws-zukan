import { useSyncExternalStore } from 'react'
const KEY = 'zukan:favorites'
function read(): string[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}
let cache: string[] = read()
let listeners: Array<() => void> = []
function emit() { localStorage.setItem(KEY, JSON.stringify(cache)); listeners.forEach(l => l()) }
const store = {
  subscribe(cb: () => void) { listeners.push(cb); return () => { listeners = listeners.filter(l => l !== cb) } },
  snapshot: () => cache,
  toggle(id: string) { cache = cache.includes(id) ? cache.filter(x => x !== id) : [...cache, id]; emit() },
}
export function useFavorites() {
  const favorites = useSyncExternalStore(store.subscribe, store.snapshot, store.snapshot)
  return { favorites, isFavorite: (id: string) => favorites.includes(id), toggle: store.toggle }
}
