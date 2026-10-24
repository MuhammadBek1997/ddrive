import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Mock manzillar — UI test uchun
const RECENT_PLACES = [
  { id: '1', name: 'Uy', address: "Chilonzor tumani, 9-kvartal", icon: '🏠' },
  { id: '2', name: 'Ish joyi', address: "Amir Temur shoh ko'chasi, 108", icon: '🏢' },
  { id: '3', name: "Toshkent shahri havo yo'llari", address: "Yunusobod tumani", icon: '✈️' },
  { id: '4', name: 'Olmazor bozori', address: "Olmazor tumani", icon: '🏪' },
]

const SUGGESTIONS = [
  { id: '5', name: "Yunusobod savdo markazi", address: "Yunusobod, 7-mavze", icon: '📍' },
  { id: '6', name: 'Osiyo Star hotel', address: "Mirzo Ulug'bek tumani", icon: '📍' },
  { id: '7', name: "Minor masjidi", address: "Mirzo Ulug'bek ko'chasi", icon: '📍' },
]

export default function SearchScreen() {
  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()
  const [query, setQuery] = useState('')

  const filtered = query.length > 1
    ? SUGGESTIONS.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.address.toLowerCase().includes(query.toLowerCase())
      )
    : []

  const handleSelect = (place: typeof RECENT_PLACES[0]) => {
    navigation.navigate('ConfirmTrip', { destination: place })
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top || 16 }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Qayerga bormoqchisiz?"
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
          autoFocus
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={() => setQuery('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={query.length > 1 ? filtered : RECENT_PLACES}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>
            {query.length > 1 ? 'Natijalar' : 'Oxirgi manzillar'}
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.placeItem} onPress={() => handleSelect(item)}>
            <View style={styles.iconBox}>
              <Text style={styles.placeIcon}>{item.icon}</Text>
            </View>
            <View style={styles.placeInfo}>
              <Text style={styles.placeName}>{item.name}</Text>
              <Text style={styles.placeAddress}>{item.address}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          query.length > 1 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Manzil topilmadi</Text>
            </View>
          ) : null
        }
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 20, color: '#1F2937' },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1F2937',
  },
  clearBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearIcon: { fontSize: 14, color: '#6B7280' },
  list: { paddingBottom: 40 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  placeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeIcon: { fontSize: 20 },
  placeInfo: { flex: 1 },
  placeName: { fontSize: 15, fontWeight: '500', color: '#1F2937' },
  placeAddress: { fontSize: 13, color: '#9CA3AF', marginTop: 2 },
  empty: { alignItems: 'center', paddingTop: 40 },
  emptyText: { fontSize: 15, color: '#9CA3AF' },
})
