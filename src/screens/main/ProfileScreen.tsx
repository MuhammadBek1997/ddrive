import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuthStore } from '../../store/authStore'

const MENU_ITEMS = [
  { icon: '📍', label: 'Manzillar', color: '#EFF6FF' },
  { icon: '💳', label: "To'lov usullari", color: '#F0FDF4' },
  { icon: '🌐', label: 'Til (Language)', color: '#FFF7ED' },
  { icon: '❓', label: 'Yordam', color: '#F5F3FF' },
  { icon: 'ℹ️', label: 'Dastur haqida', color: '#F9FAFB' },
]

export default function ProfileScreen({ navigation }: any) {
  const insets = useSafeAreaInsets()
  const { user, logout } = useAuthStore()

  return (
    <View style={[styles.container, { paddingTop: insets.top || 0 }]}>
      <View style={styles.header}><Text style={styles.title}>Profil</Text></View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* User card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </Text>
          </View>
          <View>
            <Text style={styles.userName}>{user?.name || 'Foydalanuvchi'}</Text>
            <Text style={styles.userPhone}>{user?.phone || ''}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Sayohatlar</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Buyurtmalar</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statValue}>4.9</Text>
            <Text style={styles.statLabel}>Reyting</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity key={i} style={styles.menuRow}>
              <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
                <Text style={styles.menuIconText}>{item.icon}</Text>
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Chiqish</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  title: { fontSize: 22, fontWeight: '800', color: '#111827' },
  content: { padding: 16, gap: 14, paddingBottom: 32 },
  userCard: {
    backgroundColor: '#fff', borderRadius: 18, padding: 20,
    flexDirection: 'row', alignItems: 'center', gap: 16,
  },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#1D4ED8', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 28, fontWeight: '700', color: '#fff' },
  userName: { fontSize: 18, fontWeight: '800', color: '#111827' },
  userPhone: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  editBtn: { marginLeft: 'auto' as any },
  editIcon: { fontSize: 20 },
  statsRow: {
    backgroundColor: '#fff', borderRadius: 18, padding: 20,
    flexDirection: 'row', alignItems: 'center',
  },
  statCard: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800', color: '#1D4ED8' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  statDivider: { width: 1, height: 36, backgroundColor: '#E5E7EB' },
  menuCard: { backgroundColor: '#fff', borderRadius: 18, overflow: 'hidden' },
  menuRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  menuIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuIconText: { fontSize: 20 },
  menuLabel: { flex: 1, fontSize: 15, color: '#111827', fontWeight: '500' },
  menuArrow: { fontSize: 20, color: '#9CA3AF' },
  logoutBtn: {
    backgroundColor: '#FEE2E2', borderRadius: 14, padding: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  logoutIcon: { fontSize: 20 },
  logoutText: { fontSize: 16, fontWeight: '700', color: '#DC2626' },
})
