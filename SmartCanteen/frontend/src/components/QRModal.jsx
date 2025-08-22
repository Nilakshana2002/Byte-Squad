import { useEffect } from 'react'

export default function QRModal({ open, onClose, order }) {
  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && onClose?.()
    if (open) window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [open, onClose])

  if (!open || !order) return null
  const total = (order.total_cents ?? 0) / 100

  const downloadQR = () => {
    const link = document.createElement('a')
    link.download = `order-${order.id}-qr.png`
    // Prefer backend PNG if you added GET /api/orders/:id/qr.png; fallback to data URL in order.qr_code
    link.href = order.qr_code || `/api/orders/${order.id}/qr.png`
    link.click()
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* Dialog */}
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Order #{order.id}</h3>
              <p className="text-sm text-slate-500">Show this QR at pickup</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
              aria-label="Close"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M6.4 4.9 4.9 6.4 10.5 12l-5.6 5.6 1.5 1.5L12 13.5l5.6 5.6 1.5-1.5L13.5 12l5.6-5.6-1.5-1.5L12 10.5 6.4 4.9Z"/></svg>
            </button>
          </div>

          <div className="grid place-items-center rounded-xl border border-slate-200 bg-slate-50 p-4">
            {order.qr_code ? (
              <img src={order.qr_code} alt={`Order ${order.id} QR`} className="h-auto w-56" />
            ) : (
              <img src={`/api/orders/${order.id}/qr.png`} alt={`Order ${order.id} QR`} className="h-auto w-56" />
            )}
          </div>

          <div className="mt-4 grid gap-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Total</span><span className="font-semibold text-slate-900">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Status</span><span className="font-medium">{order.status || 'PENDING'}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment</span><span className="font-medium">{order.pay_status?.replaceAll('_',' ') || 'UNPAID'}</span>
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              onClick={downloadQR}
              className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              Download QR
            </button>
            <button
              onClick={onClose}
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
