import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Button, Card, CityMap, Field, Header, Screen } from '../ui/components'
import { som, useTheme } from '../ui/theme'

const OFFERS = [
  { id: 'isuzu', title: 'Isuzu NPR', meta: 'Yukchi bilan · 40 daq', price: 240000 },
  { id: 'kamaz', title: 'KamAZ', meta: 'Katta hajm · 70 daq', price: 380000 },
]

export function CargoBookingScreen() {
  const navigation = useNavigation<any>()
  const [what, setWhat] = useState('Divan')
  const [note, setNote] = useState('3-qavat, lift yo\'q')
  const { colors } = useTheme()
  return (
    <Screen scroll footer={<Button title="Takliflarni ko'rish" onPress={() => navigation.navigate('CargoOffers', { what })} />}>
      <Header title="Yuk tashish" onBack={() => navigation.goBack()} />
      <View style={{ gap: 12, marginTop: 12 }}>
        <Card><Text style={{ color: colors.secondary }}>Qayerdan</Text><Text style={{ color: colors.text, fontWeight: '600' }}>Mustaqillik ko'chasi, 15</Text></Card>
        <Card><Text style={{ color: colors.secondary }}>Qayerga</Text><Text style={{ color: colors.text, fontWeight: '600' }}>Toshkent City Mall</Text></Card>
        <Field label="Nima tashiladi" value={what} onChangeText={setWhat} />
        <Field label="Izoh" value={note} onChangeText={setNote} multiline />
        <Text style={{ color: colors.secondary }}>Yukchilar, qavat va vaqt shu formada. Og'ir yuk alohida tashuvchi ilovasida emas, shu buyurtmada.</Text>
      </View>
    </Screen>
  )
}

export function CargoOffersScreen() {
  const navigation = useNavigation<any>()
  const { colors } = useTheme()
  const [id, setId] = useState(OFFERS[0].id)
  const picked = OFFERS.find((item) => item.id === id) || OFFERS[0]
  return (
    <Screen scroll footer={<Button title={`Band qilish · ${som(picked.price)}`} onPress={() => navigation.navigate('CargoConfirmed', picked)} />}>
      <Header title="Transport takliflari" onBack={() => navigation.goBack()} />
      <View style={{ gap: 10, marginTop: 12 }}>
        {OFFERS.map((offer) => (
          <Pressable key={offer.id} onPress={() => setId(offer.id)}>
            <Card>
              <Text style={{ color: id === offer.id ? colors.accent : colors.text, fontWeight: '700' }}>{offer.title}</Text>
              <Text style={{ color: colors.secondary }}>{offer.meta}</Text>
              <Text style={{ color: colors.text, marginTop: 4 }}>{som(offer.price)}</Text>
            </Card>
          </Pressable>
        ))}
      </View>
    </Screen>
  )
}

export function CargoConfirmedScreen() {
  const navigation = useNavigation<any>()
  const { colors } = useTheme()
  return (
    <Screen footer={<Button title="Kuzatish" onPress={() => navigation.navigate('CargoTracking')} />}>
      <View style={{ flex: 1, justifyContent: 'center', gap: 8 }}>
        <Text style={{ color: colors.text, fontSize: 28, fontWeight: '700' }}>Yuk band qilindi</Text>
        <Text style={{ color: colors.secondary }}>Isuzu NPR yo'lga chiqadi</Text>
      </View>
    </Screen>
  )
}

export function CargoTrackingScreen() {
  const navigation = useNavigation<any>()
  const { colors } = useTheme()
  return (
    <Screen map pad={false} footer={<Button title="Buyurtmalarga" onPress={() => navigation.navigate('Tabs', { screen: 'Buyurtmalar' })} />}>
      <CityMap />
      <View style={{ backgroundColor: colors.surface, padding: 16 }}>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>Yuk yo'lda</Text>
        <Text style={{ color: colors.secondary }}>Mustaqillik ko'chasi, 15 → Toshkent City Mall</Text>
      </View>
    </Screen>
  )
}
