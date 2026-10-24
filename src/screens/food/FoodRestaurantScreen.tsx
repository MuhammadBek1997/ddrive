import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const MENU = [
  { id: '1', name: 'Choyxona Palovi', desc: "Yarim porsiya palov, dumbali go'sht", price: 25000, emoji: '🍚' },
  { id: '2', name: "Go'shtli Somsa (Dona)", desc: "Qarsiloq xamir, sershira m...", price: 8000, emoji: '🥟' },
  { id: '3', name: 'Manti (5 dona)', desc: "Qo'zichoq go'shtli manti", price: 18000, emoji: '🥘' },
  { id: '4', name: 'Lag\'mon', desc: "Qo'lda tortilgan lag'mon", price: 22000, emoji: '🍜' },
]

export default function FoodRestaurantScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets()
  const [cart, setCart] = useState<Record<string, number>>({})

  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = MENU.find(m => m.id === id)
    return sum + (item?.price || 0) * qty
  }, 0)
  const totalQty = Object.values(cart).reduce((a, b) => a + b, 0)

  const add = (id: string) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }))
  const sub = (id: string) => setCart(c => { const next = { ...c }; if (next[id] > 1) next[id]--; else delete next[id]; return next })

  return (
    <View style={[styles.container, { paddingTop: insets.top || 0 }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.restaurantName}>Rayhon Milliy Taomlar</Text>
        <TouchableOpacity><Text style={styles.heartIcon}>🤍</Text></TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerEmoji}>🍽️</Text>
        </View>
        <View style={styles.restInfo}>
          <Text style={styles.restTitle}>Milliy Taomlar & Kabob</Text>
          <View style={styles.restMeta}>
            <Text style={styles.restRating}>⭐ 4.8</Text>
            <Text style={styles.restDot}>•</Text>
            <Text style={styles.restTime}>25-35 daqiqa</Text>
            <View style={styles.freeBadge}><Text style={styles.freeText}>Bepul yetkazish</Text></View>
          </View>
        </View>

        <Text style={styles.menuTitle}>Mashhur taomlar</Text>
        {MENU.map(item => (
          <View key={item.id} style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.itemEmoji}><Text style={styles.itemEmojiText}>{item.emoji}</Text></View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDesc} numberOfLines={1}>{item.desc}</Text>
                <Text style={styles.itemPrice}>{item.price.toLocaleString()} UZS</Text>
              </View>
            </View>
            {cart[item.id] ? (
              <View style={styles.qtyRow}>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => sub(item.id)}>
                  <Text style={styles.qtyBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyNum}>{cart[item.id]}</Text>
                <TouchableOpacity style={[styles.qtyBtn, styles.qtyBtnAdd]} onPress={() => add(item.id)}>
                  <Text style={[styles.qtyBtnText, styles.qtyBtnAddText]}>+</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.addBtn} onPress={() => add(item.id)}>
                <Text style={styles.addBtnText}>+</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Cart sticky */}
      {totalQty > 0 && (
        <View style={[styles.cartBar, { paddingBottom: (insets.bottom || 0) + 12 }]}>
          <TouchableOpacity
            style={styles.cartBtn}
            onPress={() => navigation.navigate('Cart', { items: cart, menu: MENU })}
          >
            <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{totalQty}</Text></View>
            <Text style={styles.cartBtnText}>Savatda: {totalQty} ta taom</Text>
            <Text style={styles.cartTotal}>{total.toLocaleString()} UZS</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff',
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 22, color: '#111827' },
  restaurantName: { fontSize: 17, fontWeight: '700', color: '#111827' },
  heartIcon: { fontSize: 22 },
  banner: {
    height: 180, backgroundColor: '#FFF7ED',
    alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, borderRadius: 16,
  },
  bannerEmoji: { fontSize: 80 },
  restInfo: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  restTitle: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 8 },
  restMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  restRating: { fontSize: 14, color: '#374151', fontWeight: '600' },
  restDot: { color: '#9CA3AF' },
  restTime: { fontSize: 14, color: '#374151' },
  freeBadge: { backgroundColor: '#DCFCE7', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  freeText: { fontSize: 12, color: '#16A34A', fontWeight: '600' },
  menuTitle: { fontSize: 18, fontWeight: '700', color: '#111827', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  itemEmoji: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' },
  itemEmojiText: { fontSize: 36 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  itemDesc: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  itemPrice: { fontSize: 14, fontWeight: '700', color: '#F97316', marginTop: 4 },
  addBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F97316', alignItems: 'center', justifyContent: 'center',
  },
  addBtnText: { fontSize: 22, color: '#fff', fontWeight: '700', lineHeight: 26 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
  },
  qtyBtnAdd: { backgroundColor: '#F97316' },
  qtyBtnText: { fontSize: 18, color: '#374151', fontWeight: '700', lineHeight: 22 },
  qtyBtnAddText: { color: '#fff' },
  qtyNum: { fontSize: 16, fontWeight: '700', color: '#111827', minWidth: 24, textAlign: 'center' },
  cartBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: '#F3F4F6',
  },
  cartBtn: {
    backgroundColor: '#F97316', borderRadius: 14, paddingVertical: 16,
    paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center',
  },
  cartBadge: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  cartBadgeText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  cartBtnText: { flex: 1, fontSize: 15, fontWeight: '700', color: '#fff' },
  cartTotal: { fontSize: 15, fontWeight: '800', color: '#fff' },
})
