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

  // Function to get food image based on menu item name
  const getFoodImage = (itemName) => {
    const name = itemName.toLowerCase()
    
    // Current menu items - exact matches
    if (name === 'chicken rice') {
      return 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&crop=center'
    }
    if (name === 'veg noodles') {
      return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&crop=center'
    }
    if (name === 'iced tea') {
      return 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&crop=center'
    }

    // Rice dishes
    if (name.includes('chicken') && name.includes('rice')) {
      return 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('fried rice') || name.includes('egg rice')) {
      return 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('biryani') || name.includes('pilaf')) {
      return 'https://images.unsplash.com/photo-1563379091339-03246963d6a6?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('rice')) {
      return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&crop=center'
    }

    // Noodles & Pasta
    if (name.includes('veg noodles') || name.includes('vegetable noodles')) {
      return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('chicken noodles') || name.includes('beef noodles')) {
      return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('noodle') || name.includes('pasta')) {
      return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('ramen') || name.includes('udon')) {
      return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('spaghetti') || name.includes('macaroni')) {
      return 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop&crop=center'
    }

    // Beverages
    if (name === 'iced tea' || name.includes('cold tea')) {
      return 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('hot tea') || name.includes('black tea') || name.includes('green tea')) {
      return 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('tea') || name.includes('coffee')) {
      return 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('iced') && (name.includes('tea') || name.includes('coffee'))) {
      return 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('milk') || name.includes('milkshake')) {
      return 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('juice') || name.includes('smoothie')) {
      return 'https://images.unsplash.com/photo-1622597480243-6c8986379e3f?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('water') || name.includes('bottle')) {
      return 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('soda') || name.includes('cola') || name.includes('pepsi')) {
      return 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('lemonade') || name.includes('lime')) {
      return 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop&crop=center'
    }

    // Fast Food
    if (name.includes('burger') || name.includes('sandwich')) {
      return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('hot dog') || name.includes('frankfurter')) {
      return 'https://images.unsplash.com/photo-1612392062129-4b030d7c3b3b?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('pizza')) {
      return 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('fries') || name.includes('chips')) {
      return 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('nuggets') || name.includes('tenders')) {
      return 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop&crop=center'
    }

    // Salads & Healthy
    if (name.includes('salad')) {
      return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('vegetable') || name.includes('veg')) {
      return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('fruit') || name.includes('apple') || name.includes('banana')) {
      return 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop&crop=center'
    }

    // Soups
    if (name.includes('soup')) {
      return 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('broth') || name.includes('stew')) {
      return 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop&crop=center'
    }

    // Desserts & Sweets
    if (name.includes('dessert') || name.includes('cake') || name.includes('ice cream')) {
      return 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('chocolate') || name.includes('candy')) {
      return 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('cookie') || name.includes('biscuit')) {
      return 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('pudding') || name.includes('custard')) {
      return 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop&crop=center'
    }

    // Seafood
    if (name.includes('fish') || name.includes('seafood')) {
      return 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('shrimp') || name.includes('prawn')) {
      return 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('crab') || name.includes('lobster')) {
      return 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop&crop=center'
    }

    // Meat dishes
    if (name.includes('steak') || name.includes('beef')) {
      return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('pork') || name.includes('bacon')) {
      return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('lamb') || name.includes('mutton')) {
      return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('chicken') && !name.includes('rice')) {
      return 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('turkey') || name.includes('duck')) {
      return 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop&crop=center'
    }

    // Asian Cuisine
    if (name.includes('curry') || name.includes('indian')) {
      return 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('sushi') || name.includes('japanese')) {
      return 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('taco') || name.includes('mexican')) {
      return 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('kebab') || name.includes('shawarma')) {
      return 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('dumpling') || name.includes('gyoza')) {
      return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('spring roll') || name.includes('egg roll')) {
      return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&crop=center'
    }

    // Bread & Bakery
    if (name.includes('bread') || name.includes('toast')) {
      return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('croissant') || name.includes('pastry')) {
      return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('muffin') || name.includes('cupcake')) {
      return 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('donut') || name.includes('doughnut')) {
      return 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop&crop=center'
    }

    // Breakfast items
    if (name.includes('egg') || name.includes('omelette')) {
      return 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('pancake') || name.includes('waffle')) {
      return 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('cereal') || name.includes('oatmeal')) {
      return 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop&crop=center'
    }

    // Snacks
    if (name.includes('popcorn') || name.includes('chips')) {
      return 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('nuts') || name.includes('almond') || name.includes('cashew')) {
      return 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('pretzel') || name.includes('cracker')) {
      return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&crop=center'
    }

    // Italian
    if (name.includes('lasagna') || name.includes('ravioli')) {
      return 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('risotto') || name.includes('gnocchi')) {
      return 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop&crop=center'
    }

    // Mediterranean
    if (name.includes('falafel') || name.includes('hummus')) {
      return 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('pita') || name.includes('flatbread')) {
      return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&crop=center'
    }

    // Thai
    if (name.includes('pad thai') || name.includes('thai')) {
      return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('tom yum') || name.includes('green curry')) {
      return 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop&crop=center'
    }

    // Korean
    if (name.includes('bibimbap') || name.includes('korean')) {
      return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('kimchi') || name.includes('bulgogi')) {
      return 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop&crop=center'
    }

    // Vietnamese
    if (name.includes('pho') || name.includes('vietnamese')) {
      return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('banh mi') || name.includes('spring roll')) {
      return 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop&crop=center'
    }

    // Chinese
    if (name.includes('chinese') || name.includes('kung pao')) {
      return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('sweet and sour') || name.includes('general tso')) {
      return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&crop=center'
    }

    // Sri Lankan specific dishes
    if (name.includes('kottu') || name.includes('roti')) {
      return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('hoppers') || name.includes('string hoppers')) {
      return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('dhal') || name.includes('lentil')) {
      return 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('pol sambol') || name.includes('coconut')) {
      return 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('rice and curry') || name.includes('curry rice')) {
      return 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop&crop=center'
    }
    if (name.includes('paratha') || name.includes('roti')) {
      return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&crop=center'
    }

    // Default food image for unknown items
    return 'https://images.unsplash.com/photo-1504674900240-9c69d0c1e5a0?w=400&h=300&fit=crop&crop=center'
  }

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

  const fmt = (cents) => `LKR ${(Number(cents || 0) / 100).toFixed(2)}`
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return q ? menu.filter(m => m.name?.toLowerCase().includes(q)) : menu
  }, [menu, search])

  const add = (item) => {
    const existing = cart.find(c => c.id === item.id)
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c))
    } else {
      setCart([...cart, { ...item, qty: 1 }])
    }
    // Show success notification
    showNotification(`${item.name} added to cart!`, 'success')
  }

  const dec = (id) => {
    const existing = cart.find(c => c.id === id)
    if (existing && existing.qty > 1) {
      setCart(cart.map(c => c.id === id ? { ...c, qty: c.qty - 1 } : c))
    } else if (existing && existing.qty === 1) {
      remove(id) // This will show confirmation dialog
    }
  }

  const remove = (id) => {
    const item = cart.find(c => c.id === id)
    if (item && window.confirm(`Are you sure you want to remove "${item.name}" from your cart?`)) {
      setCart(cart.filter(c => c.id !== id))
      showNotification(`${item.name} removed from cart`, 'info')
    }
  }

  const clear = () => {
    if (cart.length > 0 && window.confirm('Are you sure you want to clear your entire cart?')) {
      setCart([])
      showNotification('Cart cleared successfully', 'info')
    }
  }

  const itemsPayload = cart.map(c => ({ id: c.id, qty: c.qty }))
  const total = cart.reduce((s, c) => s + c.price_cents * c.qty, 0)

  const checkout = async () => {
    if (!token) {
      showNotification('Please login to place an order', 'warning')
      return
    }
    if (!cart.length) {
      showNotification('Your cart is empty', 'warning')
      return
    }
    
    try {
      const { data } = await api.post('/api/orders', { items: itemsPayload, payNow: false })
      setNewOrder(data)   // ← open QR modal
      clear()
      showNotification('Order placed successfully! Check your QR code.', 'success')
    } catch (e) {
      const errorMsg = e?.response?.data?.error || 'Checkout failed'
      showNotification(errorMsg, 'error')
    }
  }

  // Notification system
  const [notifications, setNotifications] = useState([])

  const showNotification = (message, type = 'info') => {
    const id = Date.now()
    const notification = { id, message, type }
    setNotifications(prev => [...prev, notification])
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 4000)
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: Menu */}
        <div className="lg:col-span-2">
          <header className="mb-8 px-6 pt-8">
            <div className="mb-6">
              <h1 className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent drop-shadow-sm">
                Smart Canteen Menu
              </h1>
              <p className="mt-2 text-lg text-gray-600">Discover delicious meals and add them to your cart</p>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                className="w-full rounded-2xl border-0 bg-white/90 px-12 py-4 text-lg shadow-xl backdrop-blur-sm outline-none ring-2 ring-transparent transition-all duration-300 focus:ring-purple-300 focus:shadow-2xl"
                placeholder="Search for your favorite dishes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </header>

          {error && (
            <div className="mb-6 mx-6 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-red-700 shadow-xl backdrop-blur-sm">
              <div className="flex items-center">
                <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 px-6 sm:grid-cols-2">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="group h-80 animate-pulse rounded-3xl bg-white/70 p-6 shadow-xl backdrop-blur-sm">
                    <div className="h-32 w-full rounded-2xl bg-gray-200 mb-4"></div>
                    <div className="h-4 w-3/4 rounded bg-gray-200 mb-3"></div>
                    <div className="h-3 w-1/2 rounded bg-gray-200 mb-4"></div>
                    <div className="h-10 w-full rounded-2xl bg-gray-200"></div>
                  </div>
                ))
              : filtered.map((m) => (
                  <div key={m.id} className="group relative overflow-hidden rounded-3xl bg-white/90 shadow-xl backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:bg-white/95">
                    {/* Food Image */}
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={getFoodImage(m.name)}
                        alt={m.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1504674900240-9c69d0c1e5a0?w=400&h=300&fit=crop&crop=center'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                      <div className="absolute top-4 right-4">
                        <div className="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-gray-800 shadow-lg backdrop-blur-sm">
                          {fmt(m.price_cents)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{m.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{fmt(m.price_cents)}</span>
                          {m.stock != null && (
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium shadow-sm ${
                              m.stock > 10 ? 'bg-green-100 text-green-800 ring-1 ring-green-200' : 
                              m.stock > 0 ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200' : 
                              'bg-red-100 text-red-800 ring-1 ring-red-200'
                            }`}>
                              {m.stock > 10 ? 'In Stock' : m.stock > 0 ? `Only ${m.stock} left` : 'Out of Stock'}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => add(m)}
                        disabled={m.stock === 0}
                        className="group/btn relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-3 text-white font-semibold shadow-lg transition-all duration-300 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                          </svg>
                          Add to Cart
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100"></div>
                      </button>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* Right: Cart */}
        <aside className="lg:sticky lg:top-8">
          <div className="rounded-3xl bg-white/90 p-6 shadow-2xl backdrop-blur-sm mx-6 lg:mx-0">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Your Cart</h2>
                <p className="text-sm text-gray-600">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clear}
                  className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 shadow-sm"
                >
                  Clear All
                </button>
              )}
            </div>

            {!cart.length ? (
              <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <p className="text-gray-500">Your cart is empty</p>
                <p className="text-sm text-gray-400">Add some delicious items to get started!</p>
              </div>
            ) : (
              <>
                <div className="mb-6 max-h-96 overflow-y-auto">
                  <ul className="space-y-3">
                    {cart.map((c) => (
                      <li key={c.id} className="rounded-2xl bg-gradient-to-r from-gray-50/50 to-white/50 p-4 transition-all duration-200 hover:from-gray-50 hover:to-white shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">{c.name}</h4>
                            <p className="text-sm text-gray-600">{fmt(c.price_cents)} each</p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex items-center rounded-xl bg-white shadow-sm border border-gray-200">
                              <button
                                onClick={() => dec(c.id)}
                                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-l-xl transition-colors"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="px-3 py-2 font-semibold text-gray-900 min-w-[2rem] text-center">{c.qty}</span>
                              <button
                                onClick={() => add({ id: c.id, name: c.name, price_cents: c.price_cents })}
                                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-r-xl transition-colors"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>
                            
                            <button
                              onClick={() => remove(c.id)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-2 flex items-center justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-semibold text-gray-900">{fmt(c.price_cents * c.qty)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="mb-4 flex items-center justify-between text-lg">
                    <span className="font-semibold text-gray-700">Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{fmt(total)}</span>
                  </div>

                  <button
                    onClick={checkout}
                    disabled={!cart.length || !token}
                    className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-6 py-4 text-white font-bold text-lg shadow-xl transition-all duration-300 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                    title={!token ? 'Login required' : ''}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      {token ? 'Proceed to Checkout' : 'Login to Checkout'}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </button>

                  {user && (
                    <div className="mt-4 rounded-xl bg-gradient-to-r from-indigo-50/50 to-purple-50/50 p-3 text-center">
                      <p className="text-sm text-gray-600">
                        Ordering as <span className="font-semibold text-indigo-700">{user.name}</span>
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </aside>
      </div>

      {/* QR Modal */}
      <QRModal open={!!newOrder} order={newOrder} onClose={() => setNewOrder(null)} />

      {/* Notification System */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`flex items-center gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-sm border border-white/20 min-w-[300px] max-w-[400px] transform transition-all duration-300 animate-in slide-in-from-bottom-2 ${
              notification.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
              notification.type === 'error' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' :
              notification.type === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
              'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
            }`}
          >
            {/* Icon */}
            <div className="flex-shrink-0">
              {notification.type === 'success' && (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {notification.type === 'error' && (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              {notification.type === 'warning' && (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {notification.type === 'info' && (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            
            {/* Message */}
            <div className="flex-1">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            
            {/* Close button */}
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
