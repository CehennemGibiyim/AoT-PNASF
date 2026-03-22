export function dijkstra(graph, startId, endId, weights = {}) {
  const DEFAULT_WEIGHT = { blue: 1, yellow: 2, red: 4, black: 8, road: 3, passage: 2 }
  const W = { ...DEFAULT_WEIGHT, ...weights }

  const dist = {}
  const prev = {}
  const visited = new Set()
  const queue = []

  for (const node of Object.keys(graph)) {
    dist[node] = Infinity
    prev[node] = null
  }
  dist[startId] = 0
  queue.push({ id: startId, cost: 0 })

  while (queue.length > 0) {
    queue.sort((a, b) => a.cost - b.cost)
    const { id: current } = queue.shift()
    if (visited.has(current)) continue
    visited.add(current)
    if (current === endId) break

    for (const neighbor of (graph[current] || [])) {
      const edgeCost = W[neighbor.type] ?? 1
      const newDist = dist[current] + edgeCost
      if (newDist < dist[neighbor.id]) {
        dist[neighbor.id] = newDist
        prev[neighbor.id] = current
        queue.push({ id: neighbor.id, cost: newDist })
      }
    }
  }

  if (dist[endId] === Infinity) return null

  const path = []
  let cur = endId
  while (cur !== null) {
    path.unshift(cur)
    cur = prev[cur]
  }

  return { path, cost: dist[endId] }
}
