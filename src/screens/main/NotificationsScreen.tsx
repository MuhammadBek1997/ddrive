import { View, Text, TouchableOpacity, StyleSheet, SectionList } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const SECTIONS = [
  {
    title: 'BUGUN',
    data: [
      { id: '1', title: 'Buyurtmangiz qabul qilindi!', desc: 'Rayhon Milliy Taomlar restorani buyurtmangizni tayyorlashni boshladi.', time: '10 daq oldin', read: false },
      { id: '2', title: 'Haydovchi yetib keldi', desc: 'Komfort tarifidagi oq Chevrolet Gentra uyingiz oldida kutmoqda.', time: '2 soat oldin', read: true },
    ],
  },
  {
    title: 'OLDINGI',
    data: [
      { id: '3', title: "Yangi aksiya! 20% chegirma", desc: "WELCOME20 promo-kodidan foydalaning va birinchi taksi safaringiz uchun chegirmaga ega bo'ling.", time: 'Kecha', read: true },
      { id: '4', title: 'Sayohat yakunlandi', desc: "Sherzod bilan bo'lgan safaringiz uchun to'lov qabul qilindi. Fikr qoldiring.", time: '2 kun oldin', read: true },
    ],
  },
]

export default function NotificationsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingTop: insets.top || 0 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Bildirishnomalar</Text>
        <View style={{ width: 36 }} />
      </View>

      <SectionList
        sections={SECTIONS}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <View style={[styles.notifCard, !item.read && styles.notifUnread]}>
            {!item.read && <View style={styles.unreadBar} />}
            <View style={styles.notifContent}>
              <View style={styles.notifTop}>
                <Text style={styles.notifTitle}>{item.title}</Text>
                <Text style={styles.notifTime}>{item.time}</Text>
              </View>
              <Text style={styles.notifDesc}>{item.desc}</Text>
            </View>
          </View>
        )}
      />
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
  list: { paddingBottom: 32 },
  sectionHeader: {
    fontSize: 11, fontWeight: '700', color: '#9CA3AF',
    letterSpacing: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8,
  },
  notifCard: {
    backgroundColor: '#fff', flexDirection: 'row',
    marginHorizontal: 16, marginBottom: 8, borderRadius: 14, overflow: 'hidden',
  },
  notifUnread: { backgroundColor: '#EFF6FF' },
  unreadBar: { width: 4, backgroundColor: '#1D4ED8' },
  notifContent: { flex: 1, padding: 14 },
  notifTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  notifTitle: { fontSize: 14, fontWeight: '700', color: '#111827', flex: 1, paddingRight: 8 },
  notifTime: { fontSize: 11, color: '#9CA3AF', flexShrink: 0 },
  notifDesc: { fontSize: 13, color: '#6B7280', lineHeight: 20 },
})
