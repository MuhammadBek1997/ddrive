import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function CartScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets()
  const { items = {}, menu = [] } = route.params || {}

  const cartItems = Object.entries(items)
    .map(([id, qty]) => ({ ...menu.find((m: any) => m.id === id), qty }))
    .filter((i: any) => i.name)

  const subtotal = cartItems.reduce((s: number, i: any) => s + i.price * (i.qty as number), 0)
  const delivery = 0

  return (
    <View style={[styles.container, { paddingTop: insets.top || 0 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Savat</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Delivery address */}
        <TouchableOpacity style={styles.addressCard}>
          <Text style={styles.addressPin}>📍</Text>
          <View style={styles.addressInfo}>
            <Text style={styles.addressLabel}>Yetkazib berish manzili</Text>
            <Text style={styles.addressText}>Mustaqillik shoh ko'chasi, 15</Text>
          </View>
          <Text style={styles.addressArrow}>›</Text>
        </TouchableOpacity>

        {/* Items */}
        {cartItems.map((item: any, i: number) => (
          <View key={i} style={styles.cartItem}>
            <View style={styles.itemEmoji}><Text style={styles.itemEmojiText}>{item.emoji}</Text></View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDesc} numberOfLines={1}>{item.desc}</Text>
              <Text style={styles.itemPrice}>{(item.price * item.qty).toLocaleString()} UZS</Text>
            </View>
            <View style={styles.qtyRow}>
              <Text style={styles.qtyMinus}>−</Text>
              <Text style={styles.qtyNum}>{item.qty}</Text>
              <Text style={styles.qtyPlus}>+</Text>
            </View>
          </View>
        ))}

        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taomlar narxi</Text>
            <Text style={styles.summaryValue}>{subtotal.toLocaleString()} UZS</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Yetkazib berish</Text>
            <Text style={styles.summaryFree}>Bepul</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Jami</Text>
            <Text style={styles.totalValue}>{subtotal.toLocaleString()} UZS</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: (insets.bottom || 0) + 16 }]}>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate('Payment', { total: subtotal })}
        >
          <Text style={styles.checkoutText}>Rasmiylаshtirish</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  backIcon: { fontSize: 22, color: '#111827' },
  title: { fontSize: 18, fontWeight: '700', color: '#111827' },
  content: { padding: 16, gap: 12, paddingBottom: 120 },
  addressCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  addressPin: { fontSize: 20 },
  addressInfo: { flex: 1 },
  addressLabel: { fontSize: 12, color: '#6B7280' },
  addressText: { fontSize: 14, fontWeight: '600', color: '#111827', marginTop: 2 },
  addressArrow: { fontSize: 20, color: '#9CA3AF' },
  cartItem: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  itemEmoji: { width: 56, height: 56, borderRadius: 10, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' },
  itemEmojiText: { fontSize: 32 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  itemDesc: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  itemPrice: { fontSize: 14, fontWeight: '700', color: '#F97316', marginTop: 4 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyMinus: { fontSize: 20, color: '#9CA3AF', fontWeight: '700' },
  qtyNum: { fontSize: 16, fontWeight: '700', color: '#111827', minWidth: 20, textAlign: 'center' },
  qtyPlus: { fontSize: 20, color: '#F97316', fontWeight: '700' },
  summaryCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 14, color: '#6B7280' },
  summaryValue: { fontSize: 14, color: '#111827', fontWeight: '600' },
  summaryFree: { fontSize: 14, color: '#10B981', fontWeight: '600' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#111827' },
  totalValue: { fontSize: 18, fontWeight: '800', color: '#F97316' },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: '#F3F4F6',
  },
  checkoutBtn: {
    backgroundColor: '#F97316', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
  },
  checkoutText: { fontSize: 16, fontWeight: '700', color: '#fff' },
})
