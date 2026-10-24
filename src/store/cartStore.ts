import { create } from 'zustand'

export interface CartItem {
  id: string
  title: string
  price: number
  qty: number
  place: string
}

interface CartState {
  items: CartItem[]
  add: (item: Omit<CartItem, 'qty'>) => void
  setQty: (id: string, qty: number) => void
  clear: () => void
}

export const useCart = create<CartState>()((set) => ({
  items: [],
  add: (item) =>
    set((s) => {
      const found = s.items.find((i) => i.id === item.id)
      if (found) {
        return {
          items: s.items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i)),
        }
      }
      return { items: [...s.items, { ...item, qty: 1 }] }
    }),
  setQty: (id, qty) =>
    set((s) => ({
      items: qty <= 0 ? s.items.filter((i) => i.id !== id) : s.items.map((i) => (i.id === id ? { ...i, qty } : i)),
    })),
  clear: () => set({ items: [] }),
}))

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0)
}
