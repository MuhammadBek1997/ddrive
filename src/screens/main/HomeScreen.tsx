import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useAuthStore } from '../../store/authStore'

export default function HomeScreen() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<any>()
  const user = useAuthStore(s => s.user)
  const name = user?.name?.split(' ')[0] || 'Foydalanuvchi'

  return (
    <View style={[styles.container, { paddingTop: insets.top || 0 }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Salom, {name}!</Text>
          <Text style={styles.question}>Bugun qayerga boramiz?</Text>
        </View>
        <TouchableOpacity style={styles.locationChip} onPress={() => {}}>
          <Text style={styles.locationPin}>📍</Text>
          <Text style={styles.locationText}>Toshkent</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Promo banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Ilk buyurtmaga 20%</Text>
            <Text style={styles.promoSub}>Kod kiriting: WELCOME20</Text>
            <TouchableOpacity style={styles.promoBtn}>
              <Text style={styles.promoBtnText}>Faollashtirish</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.promoEmoji}>🎉</Text>
        </View>

        {/* Service buttons */}
        <View style={styles.servicesRow}>
          <TouchableOpacity
            style={[styles.serviceCard, styles.taxiCard]}
            onPress={() => navigation.navigate('MapPicker')}
            activeOpacity={0.85}
          >
            <View style={styles.serviceIconBox}>
              <Text style={styles.serviceIcon}>🚗</Text>
            </View>
            <Text style={styles.serviceTitle}>Taksi{'\n'}chaqirish</Text>
            <Text style={styles.serviceDesc}>Tezkor va xavfsiz transport</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.serviceCard, styles.foodCard]}
            onPress={() => navigation.navigate('Buyurtma')}
            activeOpacity={0.85}
          >
            <View style={[styles.serviceIconBox, styles.foodIconBox]}>
              <Text style={styles.serviceIcon}>🛍️</Text>
            </View>
            <Text style={[styles.serviceTitle, styles.foodTitle]}>Buyurtma{'\n'}berish</Text>
            <Text style={[styles.serviceDesc, styles.foodDesc]}>Sevimli taomlar uyingizda</Text>
          </TouchableOpacity>
        </View>

        {/* Active trip notification (mock) */}
        <TouchableOpacity
          style={styles.activeCard}
          onPress={() => navigation.navigate('MapPicker')}
          activeOpacity={0.85}
        >
          <View style={styles.activeLeft}>
            <View style={styles.activeDot} />
            <View>
              <Text style={styles.activeTitle}>Komfort taksi yetib kelmoqda</Text>
              <Text style={styles.activeSub}>Haydovchi: Sherzod (01 A 777 BA)</Text>
            </View>
          </View>
          <Text style={styles.activeArrow}>›</Text>
        </TouchableOpacity>

        {/* Recent places */}
        <Text style={styles.sectionTitle}>Oxirgi manzillar</Text>
        {RECENT.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.recentItem}
            onPress={() => navigation.navigate('MapPicker')}
          >
            <View style={styles.recentIcon}>
              <Text style={styles.recentIconText}>{item.icon}</Text>
            </View>
            <View style={styles.recentInfo}>
              <Text style={styles.recentName}>{item.name}</Text>
              <Text style={styles.recentAddr}>{item.address}</Text>
            </View>
            <Text style={styles.recentArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const RECENT = [
  { icon: '🏠', name: 'Uy', address: "Mustaqillik shoh ko'chasi, 15" },
  { icon: '💼', name: 'Ish', address: "Amir Temur xiyoboni, 1" },
  { icon: '🛒', name: 'Bozor', address: "Chorsu bozori" },
]

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', paddingHorizontal: 20,
    paddingTop: 16, paddingBottom: 12, backgroundColor: '#fff',
  },
  greeting: { fontSize: 22, fontWeight: '800', color: '#111827' },
  question: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  locationChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#EFF6FF', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  locationPin: { fontSize: 13 },
  locationText: { fontSize: 13, fontWeight: '600', color: '#1D4ED8' },
  scroll: { padding: 16, gap: 16, paddingBottom: 32 },

  // Promo
  promoBanner: {
    backgroundColor: '#1D4ED8', borderRadius: 18,
    padding: 20, flexDirection: 'row', alignItems: 'center',
    overflow: 'hidden',
  },
  promoContent: { flex: 1 },
  promoTitle: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 4 },
  promoSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 12 },
  promoBtn: {
    backgroundColor: '#FACC15', borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 7, alignSelf: 'flex-start',
  },
  promoBtnText: { fontSize: 13, fontWeight: '700', color: '#111827' },
  promoEmoji: { fontSize: 52, marginLeft: 8 },

  // Services
  servicesRow: { flexDirection: 'row', gap: 12 },
  serviceCard: {
    flex: 1, borderRadius: 18, padding: 16,
    minHeight: 150, justifyContent: 'space-between',
  },
  taxiCard: { backgroundColor: '#EFF6FF' },
  foodCard: { backgroundColor: '#FFF7ED' },
  serviceIconBox: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: '#1D4ED8', alignItems: 'center', justifyContent: 'center',
  },
  foodIconBox: { backgroundColor: '#F97316' },
  serviceIcon: { fontSize: 24 },
  serviceTitle: { fontSize: 16, fontWeight: '800', color: '#1D4ED8', lineHeight: 22 },
  foodTitle: { color: '#EA580C' },
  serviceDesc: { fontSize: 11, color: '#60A5FA', lineHeight: 16 },
  foodDesc: { color: '#FB923C' },

  // Active trip card
  activeCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  activeLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  activeDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#10B981' },
  activeTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  activeSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  activeArrow: { fontSize: 22, color: '#9CA3AF' },

  // Section
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  recentItem: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  recentIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
  },
  recentIconText: { fontSize: 20 },
  recentInfo: { flex: 1 },
  recentName: { fontSize: 14, fontWeight: '600', color: '#111827' },
  recentAddr: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  recentArrow: { fontSize: 20, color: '#9CA3AF' },
})
