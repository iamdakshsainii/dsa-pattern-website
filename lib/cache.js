const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function getCached(key) {
  const item = cache.get(key)
  if (!item) return null

  if (Date.now() > item.expiry) {
    cache.delete(key)
    return null
  }

  return item.data
}

export function setCache(key, data, duration = CACHE_DURATION) {
  cache.set(key, {
    data,
    expiry: Date.now() + duration
  })
}

export function clearCache(key) {
  if (key) {
    cache.delete(key)
  } else {
    cache.clear()
  }
}
