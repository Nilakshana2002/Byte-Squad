import { useEffect, useMemo, useState } from 'react'
import { api } from '../api'

const STATUSES = ['PENDING', 'PREPARING', 'READY']

export default function Kitchen() {
  const [orders, setOrders] = useState([])
  const [status, setStatus] = useState('PENDING')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshMs, setRefreshMs] = useState(5000) // auto-refresh every 5s

  const load = async (s = status) => {
    try {
      setLoading(true)
      setError('')
      const { data } = await api.get(`/api/orders?status=${encodeURIComponent(s)}`)
      setOrders(data || [])
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load('PENDING') }, [])
  useEffect(() => { load(status) }, [status])

  // polling
  useEffect(() => {
    if (!refreshMs) return
    const id = setInterval(() => load(status), refreshMs)
    return () => clearInterval(id)
  }, [status, refreshMs])

  const markReady = async (id) => {
    await api.post(`/api/orders/${id}/ready`)
    load(status)
  }
  const markPickup = async (id) => {
    await api.post(`/api/orders/${id}/pickup`)
    load(status)
  }
  const markNoShow = async (id) => {
    await api.post(`/api/orders/${id}/no-show`)
    load(status)
  }

  const totals = useMemo(() => {
    const count = orders.length
    const sumCents = orders.reduce((s, o) => s + (o.total_cents || 0), 0)
    return { count, sumCents }
  }, [orders])

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Kitchen Dashboard</h2>
            <p className="text-sm text-slate-500">Manage incoming orders in real time</p>
          </div>

          {/* Refresh control */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Auto-refresh</label>
            <select
              className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
              value={refreshMs}
              onChange={(e) => setRefreshMs(Number(e.target.value))}
            >
              <option value={0}>Off</option>
              <option value={3000}>3s</option>
              <option value={5000}>5s</option>
              <option value={10000}>10s</option>
            </select>
            <button
              onClick={() => load(status)}
              className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Status tabs */}
        <div className="mb-6 flex gap-2">
          {STATUSES.map((s) => {
            const isActive = s === status
            return (
              <button
                key={s}
                className={[
                  'rounded-full px-4 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
                ].join(' ')}
                onClick={() => setStatus(s)}
              >
                {s}
              </button>
            )
          })}
        </div>

        {/* Summary bar */}
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm text-slate-500">Orders</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">{totals.count}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm text-slate-500">Total Value</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">
              ${(totals.sumCents / 100).toFixed(2)}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm text-slate-500">Auto-refresh</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">
              {refreshMs ? `${refreshMs / 1000}s` : 'Off'}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* List */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {loading ? (
            // skeletons
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="mb-2 h-5 w-40 rounded bg-slate-200" />
                <div className="mb-2 h-4 w-20 rounded bg-slate-200" />
                <div className="mb-3 h-4 w-56 rounded bg-slate-200" />
                <div className="flex gap-2">
                  <div className="h-9 w-24 rounded bg-slate-200" />
                  <div className="h-9 w-24 rounded bg-slate-200" />
                </div>
              </div>
            ))
          ) : orders.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              No orders in <span className="font-medium text-slate-700">{status}</span>.
            </div>
          ) : (
            orders.map((o) => (
              <OrderCard
                key={o.id}
                order={o}
                status={status}
                onReady={() => markReady(o.id)}
                onPickup={() => markPickup(o.id)}
                onNoShow={() => markNoShow(o.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function OrderCard({ order, status, onReady, onPickup, onNoShow }) {
  const total = (order.total_cents ?? 0) / 100
  const created = order.created_at ? new Date(order.created_at) : null

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-medium text-white">
            #{order.id}
          </span>
          <span className="text-sm text-slate-500">Total:</span>
          <span className="text-sm font-semibold text-slate-900">${total.toFixed(2)}</span>
        </div>
        <StatusBadge value={status} />
      </div>

      {/* Items */}
      <ul className="mb-4 mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200">
        {order.order_items?.map((it) => (
          <li key={it.id} className="flex items-center justify-between px-3 py-2 text-sm">
            <div className="flex min-w-0 items-center gap-2">
              <span className="inline-flex h-6 w-6 flex-none items-center justify-center rounded-md bg-slate-100 text-xs text-slate-600">
                {it.qty}
              </span>
              <span className="truncate text-slate-700">{it.menu_item?.name ?? 'Item'}</span>
            </div>
            <span className="text-slate-600">${((it.price_cents * it.qty) / 100).toFixed(2)}</span>
          </li>
        )) || (
          <li className="px-3 py-2 text-sm text-slate-500">No items info</li>
        )}
      </ul>

      {/* Meta */}
      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        {created && (
          <span className="rounded-md bg-slate-50 px-2 py-1">
            Placed: {created.toLocaleTimeString()}
          </span>
        )}
        <span className="rounded-md bg-slate-50 px-2 py-1">
          Pay: {order.pay_status?.replaceAll('_', ' ') || 'UNPAID'}
        </span>
        {order.user?.name && (
          <span className="rounded-md bg-slate-50 px-2 py-1">By: {order.user.name}</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {status === 'PENDING' && (
          <button
            onClick={onReady}
            className="inline-flex items-center rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-500"
          >
            Mark READY
          </button>
        )}

        {status === 'READY' && (
          <>
            <button
              onClick={onPickup}
              className="inline-flex items-center rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
            >
              Picked up
            </button>
            <button
              onClick={onNoShow}
              className="inline-flex items-center rounded-xl bg-amber-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-500"
            >
              No-show
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ value }) {
  const styles = {
    PENDING: 'bg-amber-100 text-amber-700 ring-amber-200',
    PREPARING: 'bg-blue-100 text-blue-700 ring-blue-200',
    READY: 'bg-emerald-100 text-emerald-700 ring-emerald-200'
  }[value] || 'bg-slate-100 text-slate-700 ring-slate-200'
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${styles}`}>
      {value}
    </span>
  )
}
