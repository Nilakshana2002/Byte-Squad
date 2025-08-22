import { useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import { useAuth } from '../AuthContext'
import QRModal from '../components/QRModal'

export default function Menu() {
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState([])
  const [newOrder, setNewOrder] = useState(null) // ← show QR after checkout
  const { token, user } = useAuth()

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const { data } = await api.get('/api/menu')
        setMenu(data || [])
      } catch (e) {
        setError(e?.response?.data?.error || 'Failed to load menu')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const fmt = (cents) => `$${(Number(cents || 0) / 100).toFixed(2)}`
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return q ? menu.filter(m => m.name?.toLowerCase().includes(q)) : menu
  }, [menu, search])

  const add = (item) => {
    setCart(cs => {
      const i = cs.find(x => x.id === item.id)
      return i
        ? cs.map(x => x.id === item.id ? { ...x, qty: x.qty + 1 } : x)
        : [...cs, { id: item.id, name: item.name, price_cents: item.price_cents, qty: 1 }]
    })
  }
  const dec = (id) => setCart(cs =>
    cs.map(x => x.id === id ? { ...x, qty: Math.max(1, x.qty - 1) } : x)
  )
  const remove = (id) => setCart(cs => cs.filter(x => x.id !== id))
  const clear = () => setCart([])

  const itemsPayload = cart.map(c => ({ id: c.id, qty: c.qty }))
  const total = cart.reduce((s, c) => s + c.price_cents * c.qty, 0)

  const checkout = async () => {
    if (!token) return alert('Please login to place an order.')
    if (!cart.length) return
    try {
      const { data } = await api.post('/api/orders', { items: itemsPayload, payNow: false })
      setNewOrder(data)   // ← open QR modal
      clear()
    } catch (e) {
      alert(e?.response?.data?.error || 'Checkout failed')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Menu */}
        <div className="lg:col-span-2">
          <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Menu</h2>
              <p className="text-sm text-slate-500">Pick your items and add to cart</p>
            </div>
            <input
              className="w-full max-w-xs rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              placeholder="Search menu…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </header>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white" />
                ))
              : filtered.map((m) => (
                  <div key={m.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-base font-semibold text-slate-900">{m.name}</div>
                        <div className="text-sm text-slate-600">{fmt(m.price_cents)}</div>
                        {m.stock != null && (
                          <div className="mt-1 text-xs text-slate-500">Stock: {m.stock}</div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => add(m)}
                      className="mt-3 w-full rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                    >
                      Add to cart
                    </button>
                  </div>
                ))}
          </div>
        </div>

        {/* Right: Cart */}
        <aside className="lg:sticky lg:top-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Cart</h3>
              {cart.length > 0 && (
                <button
                  onClick={clear}
                  className="text-xs text-slate-500 underline-offset-4 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            {!cart.length ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                Your cart is empty.
              </div>
            ) : (
              <ul className="mb-3 divide-y divide-slate-100 rounded-xl border border-slate-200">
                {cart.map((c) => (
                  <li key={c.id} className="grid grid-cols-5 items-center gap-2 px-3 py-2 text-sm">
                    <div className="col-span-3">
                      <div className="truncate font-medium text-slate-900">{c.name}</div>
                      <div className="text-xs text-slate-500">{fmt(c.price_cents)}</div>
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <div className="inline-flex items-center rounded-xl border border-slate-300">
                        <button
                          onClick={() => dec(c.id)}
                          className="px-2 py-1 text-slate-700 hover:bg-slate-50"
                        >
                          −
                        </button>
                        <span className="w-8 text-center">{c.qty}</span>
                        <button
                          onClick={() => add({ id: c.id, name: c.name, price_cents: c.price_cents })}
                          className="px-2 py-1 text-slate-700 hover:bg-slate-50"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => remove(c.id)}
                        className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-semibold text-slate-900">{fmt(total)}</span>
            </div>

            <button
              onClick={checkout}
              disabled={!cart.length || !token}
              className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
              title={!token ? 'Login required' : ''}
            >
              {token ? 'Checkout' : 'Login to checkout'}
            </button>

            {user && (
              <p className="mt-2 text-center text-xs text-slate-500">
                Ordering as <span className="font-medium text-slate-700">{user.name}</span>
              </p>
            )}
          </div>
        </aside>
      </div>

      {/* QR Modal */}
      <QRModal open={!!newOrder} order={newOrder} onClose={() => setNewOrder(null)} />
    </div>
  )
}
