import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'

const CATEGORIES = [
  { id: '1', name: 'Restoran', desc: 'Issiq taomlar', icon: '🍽️', color: '#FEF2F2' },
  { id: '2', name: 'Market', desc: 'Mahsulotlar', icon: '🛒', color: '#FFFBEB' },
  { id: '3', name: 'Dorixona', desc: 'Dori vositalari', icon: '💊', color: '#F0FDF4' },
  { id: '4', name: 'Gullar', desc: "Guldastalar va sovg'alar", icon: '💐', color: '#FDF4FF' },
  { id: '5', name: 'Kozmetika', desc: "Go'zallik va parvarish", icon: '✨', color: '#FFF0F9' },
  { id: '6', name: "Go'sht", desc: "Yangi so'yilgan go'sht", icon: '🥩', color: '#FFF7ED' },
]

export default function FoodCategoriesScreen() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<any>()

  return (
    <View style={[styles.container, { paddingTop: insets.top || 0 }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Kategoriyalar</Text>
        <Text style={styles.subtitle}>Siz istagan barcha yetkazib berish xizmatlari</Text>
        <TouchableOpacity style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Restoran yoki taom qidirish...</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={CATEGORIES}
        numColumns={2}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: item.color }]}
            onPress={() => navigation.navigate('FoodRestaurant', { category: item })}
            activeOpacity={0.8}
          >
            <Text style={styles.cardIcon}>{item.icon}</Text>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardDesc}>{item.desc}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#6B7280', marginBottom: 14 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#F3F4F6', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
  },
  searchIcon: { fontSize: 16 },
  searchPlaceholder: { fontSize: 14, color: '#9CA3AF' },
  grid: { padding: 16, paddingBottom: 32 },
  row: { gap: 12, marginBottom: 12 },
  card: {
    flex: 1, borderRadius: 18, padding: 18, minHeight: 120,
    justifyContent: 'space-between',
  },
  cardIcon: { fontSize: 36, marginBottom: 8 },
  cardName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  cardDesc: { fontSize: 12, color: '#6B7280', marginTop: 2 },
})
