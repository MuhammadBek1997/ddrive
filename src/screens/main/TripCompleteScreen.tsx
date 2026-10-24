import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function TripCompleteScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets()
  const { destination, tariff, price, duration, driver } = route.params || {}
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const handleSubmit = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] })
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top || 0 }]}>
      {/* Trip info bar */}
      <View style={styles.tripBar}>
        <View style={styles.tripStat}>
          <Text style={styles.tripStatLabel}>YETIB BORISH</Text>
          <Text style={styles.tripStatValue}>{duration || '10 daqiqa'}</Text>
        </View>
        <View style={styles.tripDivider} />
        <View style={styles.tripStat}>
          <Text style={styles.tripStatLabel}>MASOFA</Text>
          <Text style={styles.tripStatValue}>4.2 km</Text>
        </View>
        <View style={styles.tripDivider} />
        <View style={styles.tripStat}>
          <Text style={styles.tripStatLabel}>NARX</Text>
          <Text style={[styles.tripStatValue, styles.tripPrice]}>
            {price || tariff?.priceNum?.toLocaleString() || '18 000'} UZS
          </Text>
        </View>
      </View>

      {/* Rating card */}
      <View style={styles.ratingCard}>
        <View style={styles.checkCircle}>
          <Text style={styles.checkIcon}>✓</Text>
        </View>
        <Text style={styles.doneTitle}>Sayohat yakunlandi!</Text>
        <Text style={styles.doneSubtitle}>
          {driver?.name || 'Sherzod'}ga sayohat uchun baho bering
        </Text>

        {/* Stars */}
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map(s => (
            <TouchableOpacity key={s} onPress={() => setRating(s)}>
              <Text style={[styles.star, s <= rating && styles.starFilled]}>★</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Comment */}
        <TextInput
          style={styles.commentInput}
          placeholder="Fikr va takliflar (ixtiyoriy)..."
          placeholderTextColor="#9CA3AF"
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity
          style={[styles.submitBtn, !rating && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!rating}
        >
          <Text style={styles.submitText}>Yuborish</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn} onPress={handleSubmit}>
          <Text style={styles.skipText}>O'tkazib yuborish</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  tripBar: {
    flexDirection: 'row', backgroundColor: '#fff',
    paddingVertical: 16, paddingHorizontal: 20,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  tripStat: { flex: 1, alignItems: 'center' },
  tripStatLabel: { fontSize: 10, color: '#9CA3AF', fontWeight: '700', letterSpacing: 0.5 },
  tripStatValue: { fontSize: 16, fontWeight: '800', color: '#111827', marginTop: 4 },
  tripPrice: { color: '#1D4ED8' },
  tripDivider: { width: 1, backgroundColor: '#E5E7EB', marginHorizontal: 8 },
  ratingCard: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 32, gap: 16,
  },
  checkCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  checkIcon: { fontSize: 36, color: '#16A34A' },
  doneTitle: { fontSize: 24, fontWeight: '800', color: '#111827', textAlign: 'center' },
  doneSubtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
  starsRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  star: { fontSize: 40, color: '#E5E7EB' },
  starFilled: { color: '#FACC15' },
  commentInput: {
    width: '100%', borderWidth: 1.5, borderColor: '#E5E7EB',
    borderRadius: 12, padding: 14, fontSize: 14,
    color: '#111827', textAlignVertical: 'top', minHeight: 80,
    backgroundColor: '#F9FAFB',
  },
  submitBtn: {
    width: '100%', backgroundColor: '#1D4ED8', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
  },
  submitBtnDisabled: { backgroundColor: '#9CA3AF' },
  submitText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  skipBtn: { paddingVertical: 8 },
  skipText: { fontSize: 14, color: '#9CA3AF' },
})
