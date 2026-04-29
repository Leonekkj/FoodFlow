const BASE = '/api'

async function req(path, opts = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

export const api = {
  get:   (path)        => req(path),
  post:  (path, body)  => req(path, { method: 'POST',  body: JSON.stringify(body) }),
  patch: (path, body)  => req(path, { method: 'PATCH', body: JSON.stringify(body) }),
}
