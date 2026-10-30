import { useEffect, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Button, Card, CityMap, Header, RoundButton, Screen } from '../ui/components'
import { som, useTheme } from '../ui/theme'

const PLACES = [
  { title: 'Toshkent City Mall', meta: "Furqat ko'chasi, 5 · 4.2 km" },
  { title: 'Toshkent City Park', meta: 'Navoiy shoh ko\'chasi · 4.6 km' },
  { title: 'Toshkent City Boulevard', meta: 'Oxirgi safar · 3 kun oldin · 4.4 km' },
  { title: 'Hilton Tashkent City', meta: 'Islom Karimov ko\'chasi, 2 · 4.8 km' },
]

const TARIFFS = [
  { id: 'ekonom', title: 'Ekonom', price: 14000, eta: '3 daq', seats: '4' },
  { id: 'komfort', title: 'Komfort', price: 19000, eta: '2 daq', seats: '4' },
  { id: 'biznes', title: 'Biznes', price: 34000, eta: '6 daq', seats: '4' },
  { id: 'minivan', title: 'Minivan', price: 28000, eta: '8 daq', seats: '7' },
]

export function DestinationScreen() {
  const navigation = useNavigation<any>()
  const { colors } = useTheme()
  const [picked, setPicked] = useState(PLACES[0].title)
  return (
    <Screen scroll footer={<Button title="Davom etish" onPress={() => navigation.navigate('Tariffs', { to: picked })} />}>
      <Header title="Qayerga boramiz?" onBack={() => navigation.goBack()} />
      <Card>
        <Text style={{ color: colors.secondary }}>Qayerdan</Text>
        <Text style={{ color: colors.text, fontWeight: '600' }}>Mustaqillik ko'chasi, 15</Text>
      </Card>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 12 }}>
        {['Uy', 'Ish', 'Universitet', "Qo'shish"].map((chip) => (
          <View key={chip} style={{ backgroundColor: colors.accentSoft, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 }}>
            <Text style={{ color: colors.accent, fontWeight: '600' }}>{chip}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={{ gap: 8 }}>
        {PLACES.map((place) => (
          <Pressable key={place.title} onPress={() => setPicked(place.title)} style={{ borderRadius: 14, borderWidth: 1, borderColor: picked === place.title ? colors.accent : colors.border, backgroundColor: colors.surface, padding: 12 }}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{place.title}</Text>
            <Text style={{ color: colors.secondary }}>{place.meta}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable onPress={() => navigation.navigate('PinLandmark')} style={{ marginTop: 14 }}>
        <Text style={{ color: colors.accent, fontWeight: '700' }}>Xaritadan pin va mo'ljal</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('OutOfArea')} style={{ marginTop: 8 }}>
        <Text style={{ color: colors.error, fontWeight: '700' }}>Hududdan tashqari</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('LocationPermission')} style={{ marginTop: 8 }}>
        <Text style={{ color: colors.secondary, fontWeight: '700' }}>Joylashuv ruxsati yo'q</Text>
      </Pressable>
    </Screen>
  )
}

export function TariffsScreen() {
  const navigation = useNavigation<any>()
  const { colors } = useTheme()
  const [tariff, setTariff] = useState(TARIFFS[1])
  const [pay, setPay] = useState('Naqd')
  return (
    <Screen pad={false} map footer={<Button title={`Taksi chaqirish · ${som(tariff.price)}`} onPress={() => navigation.navigate('Searching', { tariff: tariff.title, price: tariff.price })} />}>
      <CityMap>
        <View style={{ position: 'absolute', top: 12, left: 12, right: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
          <RoundButton label="‹" onPress={() => navigation.goBack()} />
          <RoundButton label="◎" />
        </View>
        <View style={{ position: 'absolute', top: '42%', alignSelf: 'center', backgroundColor: colors.surface, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 }}>
          <Text style={{ color: colors.text, fontWeight: '700' }}>14 daq · 4.2 km</Text>
        </View>
      </CityMap>
      <View style={{ backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16, gap: 10 }}>
        <Text style={{ color: colors.secondary }}>Qayerdan · Mustaqillik ko'chasi, 15</Text>
        <Text style={{ color: colors.secondary }}>Qayerga · Toshkent City Mall</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {TARIFFS.map((item) => {
            const active = item.id === tariff.id
            return (
              <Pressable key={item.id} onPress={() => setTariff(item)} style={{ width: 132, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: active ? colors.accent : colors.border, backgroundColor: active ? colors.accentSoft : colors.canvas }}>
                <Text style={{ color: colors.text, fontWeight: '700' }}>{item.title}</Text>
                <Text style={{ color: colors.text, marginTop: 6 }}>{som(item.price)}</Text>
                <Text style={{ color: colors.secondary, marginTop: 4 }}>{item.eta} · {item.seats}</Text>
              </Pressable>
            )
          })}
        </ScrollView>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {['Naqd', 'Hozir', 'Izoh'].map((item) => (
            <Pressable key={item} onPress={() => setPay(item)} style={{ backgroundColor: pay === item ? colors.accentSoft : colors.subtle, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 }}>
              <Text style={{ color: colors.text, fontWeight: '600' }}>{item}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Screen>
  )
}

export function SearchingScreen() {
  const navigation = useNavigation<any>()
  const { colors } = useTheme()
  useEffect(() => {
    const id = setTimeout(() => navigation.replace('DriverFound'), 2200)
    return () => clearTimeout(id)
  }, [navigation])
  return (
    <Screen map pad={false}>
      <CityMap>
        <View style={{ flex: 1, justifyContent: 'flex-end', padding: 24 }}>
          <Card>
            <Text style={{ color: colors.text, fontSize: 20, fontWeight: '700' }}>Haydovchi qidirilmoqda</Text>
            <Text style={{ color: colors.secondary, marginTop: 6 }}>Komfort · atrofda bo'sh mashinalar</Text>
            <Pressable onPress={() => navigation.replace('DriverFound')} style={{ marginTop: 10 }}>
              <Text style={{ color: colors.accent, fontWeight: '700' }}>Topilganini ko'rish</Text>
            </Pressable>
            <Pressable onPress={() => navigation.replace('TaxiTimeout')} style={{ marginTop: 8 }}>
              <Text style={{ color: colors.error, fontWeight: '700' }}>Haydovchi topilmadi</Text>
            </Pressable>
          </Card>
        </View>
      </CityMap>
    </Screen>
  )
}

export function DriverFoundScreen() {
  const navigation = useNavigation<any>()
  const { colors } = useTheme()
  return (
    <Screen map pad={false} footer={<Button title="Jonli safar" onPress={() => navigation.navigate('LiveRide')} />}>
      <CityMap />
      <View style={{ backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16, gap: 6 }}>
        <Text style={{ color: colors.success, fontWeight: '700' }}>Haydovchi 3 daqiqada keladi</Text>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>Sherzod · 4.92 ★</Text>
        <Text style={{ color: colors.secondary }}>Chevrolet Cobalt · 01 A 777 BA</Text>
        <Text style={{ color: colors.text, marginTop: 8 }}>Komfort · 19 000 so'm</Text>
        <Pressable onPress={() => navigation.navigate('FreeWait')}><Text style={{ color: colors.accent, fontWeight: '700' }}>Bepul kutish</Text></Pressable>
        <Pressable onPress={() => navigation.navigate('CancelRide')}><Text style={{ color: colors.error, fontWeight: '700' }}>Bekor qilish</Text></Pressable>
        <Pressable onPress={() => navigation.navigate('Chat')}><Text style={{ color: colors.accent, fontWeight: '700' }}>Chat</Text></Pressable>
      </View>
    </Screen>
  )
}

export function LiveRideScreen() {
  const navigation = useNavigation<any>()
  const { colors } = useTheme()
  return (
    <Screen map pad={false} footer={<Button title="Baho berish" onPress={() => navigation.navigate('Rating')} />}>
      <CityMap>
        <Pressable onPress={() => navigation.navigate('Sos')} style={{ position: 'absolute', top: 16, right: 16, backgroundColor: colors.error, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>SOS</Text>
        </Pressable>
      </CityMap>
      <View style={{ backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16, gap: 6 }}>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '700' }}>Manzilga 9 daqiqa</Text>
        <Text style={{ color: colors.secondary }}>Yetib borish 14:52 · 2.8 km qoldi</Text>
        <Text style={{ color: colors.secondary }}>Safar jarayoni · 62%</Text>
        <Text style={{ color: colors.text }}>Mustaqillik ko'chasi, 15 → Toshkent City Mall</Text>
        <Text style={{ color: colors.text, fontWeight: '600' }}>Sherzod · 4.92 ★ · Chevrolet Cobalt · 01 777 BA</Text>
        <Pressable onPress={() => navigation.navigate('PriceChanged')}><Text style={{ color: colors.warning, fontWeight: '700' }}>Narx o'zgardi</Text></Pressable>
        <Pressable onPress={() => navigation.navigate('RideOffline')}><Text style={{ color: colors.secondary, fontWeight: '700' }}>Aloqa yo'q</Text></Pressable>
        <Pressable onPress={() => navigation.navigate('DriverCancelled')}><Text style={{ color: colors.error, fontWeight: '700' }}>Haydovchi bekor qildi</Text></Pressable>
      </View>
    </Screen>
  )
}

export function RatingScreen() {
  const navigation = useNavigation<any>()
  const [stars, setStars] = useState(5)
  const { colors } = useTheme()
  return (
    <Screen footer={<Button title="Yuborish" onPress={() => navigation.navigate('Tabs', { screen: 'Tarix' })} />}>
      <Header title="Safar yakunlandi" onBack={() => navigation.goBack()} />
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700', marginTop: 12 }}>Haydovchini baholang</Text>
      <Text style={{ color: colors.secondary, marginBottom: 12 }}>19 000 so'm · naqd · 4.2 km · 14 daq. Choycha yo'q.</Text>
      <Text style={{ color: colors.secondary, marginBottom: 8 }}>Toza mashina · Xushmuomala · Ehtiyotkor</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable key={n} onPress={() => setStars(n)}>
            <Text style={{ fontSize: 32, color: n <= stars ? '#D99A28' : colors.border }}>★</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  )
}
