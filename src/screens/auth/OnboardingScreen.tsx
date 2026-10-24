import { useState, useRef } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  Dimensions, ScrollView, Image,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { width } = Dimensions.get('window')

const SLIDES = [
  {
    title: 'Barchasi bir joyda',
    subtitle: 'Taksi chaqirish va sevimli taomlaringizni buyurtma qilish endi yagona ilovada yanada osonroq!',
  },
  {
    title: 'Tezkor va xavfsiz',
    subtitle: 'Professional haydovchilar bilan qulay va xavfsiz sayohat qiling, istalgan vaqtda.',
  },
  {
    title: 'Taomlar eshikka',
    subtitle: 'Sevimli restoranlaringizdan taom buyurtma qiling — 30 daqiqada uyingizga yetkaziladi.',
  },
]

export default function OnboardingScreen({ navigation }: any) {
  const insets = useSafeAreaInsets()
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<ScrollView>(null)

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      const next = activeIndex + 1
      scrollRef.current?.scrollTo({ x: next * width, animated: true })
      setActiveIndex(next)
    } else {
      navigation.navigate('Phone')
    }
  }

  const handleScroll = (e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width)
    setActiveIndex(idx)
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Logo */}
      <View style={styles.logoRow}>
        <View style={styles.logoBox}>
          <Text style={styles.logoIcon}>🛍️</Text>
        </View>
        <Text style={styles.logoText}>Zoomer</Text>
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={styles.slider}
      >
        {SLIDES.map((slide, i) => (
          <View key={i} style={styles.slide}>
            {/* Illustration placeholder */}
            <View style={styles.illustrationBox}>
              <Text style={styles.illustrationEmoji}>
                {i === 0 ? '🚖' : i === 1 ? '🚗' : '🛵'}
              </Text>
            </View>
            <Text style={styles.slideTitle}>{slide.title}</Text>
            <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex && styles.dotActive]}
          />
        ))}
      </View>

      {/* Button */}
      <View style={[styles.bottomArea, { paddingBottom: (insets.bottom || 0) + 24 }]}>
        <TouchableOpacity style={styles.btn} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.btnText}>
            {activeIndex < SLIDES.length - 1 ? 'Keyingisi' : 'Boshlash'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Phone')} style={styles.skipBtn}>
          <Text style={styles.skipText}>O'tkazib yuborish</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  logoRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8,
  },
  logoBox: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: '#F97316', alignItems: 'center', justifyContent: 'center',
  },
  logoIcon: { fontSize: 20 },
  logoText: { fontSize: 22, fontWeight: '800', color: '#111827', letterSpacing: 0.5 },
  slider: { flex: 1 },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
  },
  illustrationBox: {
    width: 220, height: 220, borderRadius: 110,
    backgroundColor: '#F3F4F6',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 40,
  },
  illustrationEmoji: { fontSize: 96 },
  slideTitle: {
    fontSize: 26, fontWeight: '800', color: '#111827',
    textAlign: 'center', marginBottom: 14, lineHeight: 34,
  },
  slideSubtitle: {
    fontSize: 15, color: '#6B7280',
    textAlign: 'center', lineHeight: 24,
  },
  dotsRow: {
    flexDirection: 'row', justifyContent: 'center',
    gap: 8, paddingBottom: 24,
  },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  dotActive: {
    width: 24, backgroundColor: '#1D4ED8',
  },
  bottomArea: { paddingHorizontal: 24, gap: 12 },
  btn: {
    backgroundColor: '#1D4ED8', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  skipBtn: { alignItems: 'center', paddingVertical: 4 },
  skipText: { fontSize: 14, color: '#9CA3AF' },
})
