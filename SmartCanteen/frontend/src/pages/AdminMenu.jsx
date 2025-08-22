import { useEffect, useMemo, useState } from 'react'
import { api } from '../api'

export default function AdminMenu() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('name_asc')
  const [form, setForm] = useState({ name: '', price_cents: 0, stock: 0, is_active: true })
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editDraft, setEditDraft] = useState({})

  const load = async () => {
    try {
      setLoading(true)
      setError('')
      const { data } = await api.get('/api/menu') // public list; admin can CRUD via POST/PUT/DELETE
      setItems(data || [])
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to load menu')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [])

  // --- helpers ---
  const fmt = (cents) => `$${(Number(cents || 0) / 100).toFixed(2)}`
  const parseIntSafe = (v) => Number.isFinite(+v) ? Math.max(0, Math.trunc(+v)) : 0

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = [...items]
    if (q) list = list.filter(i => i.name?.toLowerCase().includes(q))
    if (sort === 'name_asc') list.sort((a,b)=>a.name.localeCompare(b.name))
    if (sort === 'name_desc') list.sort((a,b)=>b.name.localeCompare(a.name))
    if (sort === 'price_asc') list.sort((a,b)=>a.price_cents-b.price_cents)
    if (sort === 'price_desc') list.sort((a,b)=>b.price_cents-a.price_cents)
    return list
  }, [items, search, sort])

  // --- create ---
  const createItem = async () => {
    try {
      setSaving(true)
      setError('')
      if (!form.name?.trim()) throw new Error('Name is required')
      await api.post('/api/menu', {
        name: form.name.trim(),
        price_cents: parseIntSafe(form.price_cents),
        stock: form.stock === '' ? null : parseIntSafe(form.stock),
        is_active: !!form.is_active
      })
      setForm({ name: '', price_cents: 0, stock: 0, is_active: true })
      await load()
    } catch (e) {
      setError(e?.response?.data?.error || e.message || 'Create failed')
    } finally {
      setSaving(false)
    }
  }

  // --- update ---
  const startEdit = (item) => {
    setEditingId(item.id)
    setEditDraft({
      name: item.name,
      price_cents: item.price_cents,
      stock: item.stock ?? 0,
      is_active: !!item.is_active
    })
  }
  const cancelEdit = () => { setEditingId(null); setEditDraft({}) }

  const saveEdit = async (id) => {
    try {
      setSaving(true)
      await api.put(`/api/menu/${id}`, {
        name: editDraft.name.trim(),
        price_cents: parseIntSafe(editDraft.price_cents),
        stock: editDraft.stock === '' ? null : parseIntSafe(editDraft.stock),
        is_active: !!editDraft.is_active
      })
      setEditingId(null)
      setEditDraft({})
      await load()
    } catch (e) {
      setError(e?.response?.data?.error || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (item) => {
    try {
      await api.put(`/api/menu/${item.id}`, { is_active: !item.is_active })
      await load()
    } catch (e) {
      setError(e?.response?.data?.error || 'Toggle failed')
    }
  }

  // --- delete ---
  const remove = async (id) => {
    if (!confirm('Delete this item?')) return
    try {
      await api.delete(`/api/menu/${id}`)
      await load()
    } catch (e) {
      setError(e?.response?.data?.error || 'Delete failed')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Admin — Menu</h2>
            <p className="text-sm text-slate-500">Create, edit, activate, or remove items</p>
          </div>
          <div className="flex gap-2">
            <input
              className="w-56 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              placeholder="Search items…"
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
            />
            <select
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              value={sort}
              onChange={(e)=>setSort(e.target.value)}
            >
              <option value="name_asc">Name ↑</option>
              <option value="name_desc">Name ↓</option>
              <option value="price_asc">Price ↑</option>
              <option value="price_desc">Price ↓</option>
            </select>
          </div>
        </header>

        {/* Error banner */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Create form */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Add new item</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
            <input
              className="col-span-2 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              placeholder="Name"
              value={form.name}
              onChange={(e)=>setForm({...form, name: e.target.value})}
            />
            <input
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              type="number"
              min="0"
              placeholder="Price (cents)"
              value={form.price_cents}
              onChange={(e)=>setForm({...form, price_cents: e.target.value})}
            />
            <input
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              type="number"
              min="0"
              placeholder="Stock (optional)"
              value={form.stock}
              onChange={(e)=>setForm({...form, stock: e.target.value})}
            />
            <div className="flex items-center justify-between gap-2">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e)=>setForm({...form, is_active: e.target.checked})}
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-300"
                />
                Active
              </label>
              <button
                onClick={createItem}
                disabled={saving}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Create'}
              </button>
            </div>
          </div>
        </section>

        {/* Table/list */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="mb-2 h-12 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No items found.</div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filtered.map((i) => (
                <li key={i.id} className="grid grid-cols-1 items-center gap-3 p-4 sm:grid-cols-12">
                  {/* Name */}
                  <div className="sm:col-span-4">
                    {editingId === i.id ? (
                      <input
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                        value={editDraft.name}
                        onChange={(e)=>setEditDraft({...editDraft, name: e.target.value})}
                      />
                    ) : (
                      <div className="font-medium text-slate-900">{i.name}</div>
                    )}
                    <div className="text-xs text-slate-500">#{i.id}</div>
                  </div>

                  {/* Price */}
                  <div className="sm:col-span-2">
                    <div className="text-sm text-slate-700">{fmt(i.price_cents)}</div>
                    {editingId === i.id && (
                      <input
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                        type="number"
                        min="0"
                        value={editDraft.price_cents}
                        onChange={(e)=>setEditDraft({...editDraft, price_cents: e.target.value})}
                        placeholder="Price (cents)"
                      />
                    )}
                  </div>

                  {/* Stock */}
                  <div className="sm:col-span-2">
                    <div className="text-sm text-slate-700">Stock: {i.stock ?? '—'}</div>
                    {editingId === i.id && (
                      <input
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                        type="number"
                        min="0"
                        value={editDraft.stock}
                        onChange={(e)=>setEditDraft({...editDraft, stock: e.target.value})}
                        placeholder="Stock"
                      />
                    )}
                  </div>

                  {/* Active toggle */}
                  <div className="sm:col-span-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1
                      ${i.is_active ? 'bg-emerald-100 text-emerald-700 ring-emerald-200' : 'bg-slate-100 text-slate-700 ring-slate-200'}`}>
                      {i.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {editingId === i.id && (
                      <label className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                        <input
                          type="checkbox"
                          checked={!!editDraft.is_active}
                          onChange={(e)=>setEditDraft({...editDraft, is_active: e.target.checked})}
                          className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-300"
                        />
                        Active
                      </label>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 sm:col-span-2 sm:justify-end">
                    {editingId === i.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(i.id)}
                          className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
                          disabled={saving}
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(i)}
                          className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleActive(i)}
                          className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-500"
                        >
                          {i.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => remove(i.id)}
                          className="rounded-xl bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-500"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
