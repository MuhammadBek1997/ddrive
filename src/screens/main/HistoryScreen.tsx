import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuthStore } from '../../store/authStore'

const HISTORY = [
  { id: '1', type: 'taxi', tariff: 'Komfort', status: 'done', time: 'Bugun, 14:20', dest: 'Amir Temur xiyoboni', price: '18 000 UZS' },
  { id: '2', type: 'food', restaurant: 'Rayhon Milliy Taomlar', status: 'done', time: 'Kecha, 19:45', desc: '2 ta taom', price: '33 000 UZS' },
  { id: '3', type: 'taxi', tariff: 'Ekonom', status: 'cancelled', time: '24-Yanvar, 08:30', dest: 'Tashkent City Mall', price: '12 000 UZS' },
]

export default function HistoryScreen() {
  const insets = useSafeAreaInsets()
  const token = useAuthStore(s => s.token)
  const isGuest = token === 'guest'

  if (isGuest) {
    return (
      <View style={[styles.container, { paddingTop: insets.top || 0 }]}>
        <View style={styles.header}><Text style={styles.title}>Sayohatlar tarixi</Text></View>
        <View style={styles.emptyCenter}>
          <View style={styles.emptyImg}><Text style={styles.emptyEmoji}>📋</Text></View>
          <Text style={styles.emptyTitle}>Tarix mavjud emas</Text>
          <Text style={styles.emptyDesc}>Sayohat va buyurtmalar tarixini ko'rish uchun iltimos ro'yxatdan o'ting</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top || 0 }]}>
      <View style={styles.header}><Text style={styles.title}>Sayohatlar tarixi</Text></View>
      <FlatList
        data={HISTORY}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.historyCard}>
            <View style={styles.historyIcon}>
              <Text style={styles.historyIconText}>{item.type === 'taxi' ? '🚗' : '🛍️'}</Text>
            </View>
            <View style={styles.historyInfo}>
              <View style={styles.historyTop}>
                <Text style={styles.historyTitle}>
                  {item.type === 'taxi' ? `Taksi • ${item.tariff}` : item.restaurant}
                </Text>
                <View style={[styles.statusBadge, item.status === 'cancelled' && styles.statusCancelled]}>
                  <Text style={[styles.statusText, item.status === 'cancelled' && styles.statusTextCancelled]}>
                    {item.status === 'done' ? 'Yakunlandi' : 'Bekor qilindi'}
                  </Text>
                </View>
              </View>
              <Text style={styles.historyTime}>{item.time}</Text>
              <Text style={styles.historyDest} numberOfLines={1}>
                {item.type === 'taxi' ? item.dest : item.desc}
              </Text>
            </View>
            <Text style={styles.historyPrice}>{item.price}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  title: { fontSize: 22, fontWeight: '800', color: '#111827' },
  list: { padding: 16, gap: 10, paddingBottom: 32 },
  historyCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  historyIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  historyIconText: { fontSize: 24 },
  historyInfo: { flex: 1 },
  historyTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  historyTitle: { fontSize: 14, fontWeight: '700', color: '#111827', flex: 1 },
  statusBadge: { backgroundColor: '#DCFCE7', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  statusCancelled: { backgroundColor: '#FEE2E2' },
  statusText: { fontSize: 11, fontWeight: '700', color: '#16A34A' },
  statusTextCancelled: { color: '#DC2626' },
  historyTime: { fontSize: 12, color: '#9CA3AF' },
  historyDest: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  historyPrice: { fontSize: 14, fontWeight: '700', color: '#111827' },
  emptyCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 48 },
  emptyImg: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8, textAlign: 'center' },
  emptyDesc: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22 },
})
