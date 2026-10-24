import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { cartTotal, useCart } from '../store/cartStore'
import { Button, Card, CityMap, Field, Header, Screen } from '../ui/components'
import { som, useTheme } from '../ui/theme'

const PLACES = [
  { id: 'rayhon', name: 'Rayhon milliy taomlari', meta: '4.9 · 25–35 daq', fee: 'Bepul yetkazish', kind: 'national' },
  { id: 'burger', name: 'Burger Lab', meta: '4.7 · 20–30 daq', fee: "Yetkazish 5 000", kind: 'fast' },
  { id: 'shashlik', name: 'Shashlik House', meta: '4.8 · 30–40 daq', fee: 'Bepul yetkazish', kind: 'fast' },
]

const MENUS: Record<string, { id: string; title: string; price: number }[]> = {
  rayhon: [
    { id: 'plov', title: "Plov · choyxona usulida", price: 38000 },
    { id: 'somsa', title: "Go'shtli somsa", price: 8000 },
  ],
  burger: [
    { id: 'double', title: 'Double burger', price: 42000 },
    { id: 'sezar', title: 'Sezar salat', price: 36000 },
  ],
  shashlik: [
    { id: 'shashlik', title: 'Shashlik', price: 45000 },
  ],
}

export const CATALOGS: Record<string, { title: string; items: { id: string; title: string; price: number; meta: string }[] }> = {
  grocery: {
    title: 'Market',
    items: [
      { id: 'guruch', title: 'Guruch Devzira, 1 kg', price: 32000, meta: 'Market' },
      { id: 'sut', title: 'Sut 1 l', price: 12000, meta: 'Market' },
      { id: 'apelsin', title: 'Fresh apelsin', price: 18000, meta: 'Market' },
    ],
  },
  household: {
    title: "Uy-ro'zg'or",
    items: [
      { id: 'clean', title: 'Tozalash vositasi', price: 24000, meta: 'Uy' },
      { id: 'soap', title: 'Sovun to\'plami', price: 15000, meta: 'Uy' },
    ],
  },
  electronics: {
    title: 'Elektronika',
    items: [
      { id: 'cable', title: 'Zaryad kabeli', price: 45000, meta: 'Elektronika' },
      { id: 'buds', title: 'Quloqchin', price: 189000, meta: 'Elektronika' },
    ],
  },
  flowers: {
    title: 'Gullar',
    items: [
      { id: 'rose', title: 'Atirgul, 11 dona', price: 120000, meta: 'Gullar' },
      { id: 'mix', title: 'Aralash guldasta', price: 95000, meta: 'Gullar' },
    ],
  },
  pharmacy: {
    title: 'Dorixona',
    items: [
      { id: 'para', title: 'Paracetamol 500 mg', price: 8500, meta: 'Dorixona №1' },
      { id: 'vita', title: 'Vitamin C', price: 22000, meta: 'Dorixona №1' },
    ],
  },
}

export function RestaurantsScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const initial = route.params?.kind === 'national' ? 'Milliy' : 'Fast food'
  const [tab, setTab] = useState(initial)
  const { colors } = useTheme()
  const list = PLACES.filter((place) => (tab === 'Milliy' ? place.kind === 'national' : place.kind === 'fast' || tab === 'Milliy'))
  const shown = tab === 'Milliy' ? PLACES.filter((p) => p.kind === 'national') : PLACES.filter((p) => p.kind === 'fast')
  return (
    <Screen scroll>
      <Header title={tab === 'Milliy' ? 'Milliy taomlar' : 'Fast food'} onBack={() => navigation.goBack()} />
      <View style={{ flexDirection: 'row', gap: 8, marginVertical: 12 }}>
        {['Fast food', 'Milliy'].map((item) => (
          <Pressable key={item} onPress={() => setTab(item)} style={{ backgroundColor: tab === item ? colors.accent : colors.surface, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 }}>
            <Text style={{ color: tab === item ? '#fff' : colors.text, fontWeight: '600' }}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <View style={{ gap: 10 }}>
        {(shown.length ? shown : list).map((place) => (
          <Card key={place.id} onPress={() => navigation.navigate('Restaurant', { id: place.id })}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{place.name}</Text>
            <Text style={{ color: colors.secondary }}>{place.meta}</Text>
            <Text style={{ color: colors.success }}>{place.fee}</Text>
          </Card>
        ))}
      </View>
    </Screen>
  )
}

export function RestaurantScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const id = route.params?.id || 'rayhon'
  const place = PLACES.find((item) => item.id === id) || PLACES[0]
  const menu = MENUS[place.id] || MENUS.rayhon
  const { colors } = useTheme()
  return (
    <Screen scroll>
      <Header title={place.name} onBack={() => navigation.goBack()} />
      <Text style={{ color: colors.secondary, marginVertical: 8 }}>{place.meta} · {place.fee}</Text>
      <View style={{ gap: 10 }}>
        {menu.map((item) => (
          <Card key={item.id} onPress={() => navigation.navigate('Item', { ...item, place: place.name })}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{item.title}</Text>
            <Text style={{ color: colors.text, marginTop: 4 }}>{som(item.price)}</Text>
          </Card>
        ))}
      </View>
    </Screen>
  )
}

export function ItemScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const add = useCart((s) => s.add)
  const { colors } = useTheme()
  const item = route.params || { id: 'plov', title: 'Plov', price: 38000, place: 'Rayhon' }
  const [qty, setQty] = useState(1)
  return (
    <Screen footer={
      <Button title={`Savatga · ${som(item.price * qty)}`} onPress={() => {
        for (let i = 0; i < qty; i += 1) add({ id: item.id, title: item.title, price: item.price, place: item.place })
        navigation.navigate('Cart')
      }} />
    }>
      <Header title="Taom" onBack={() => navigation.goBack()} />
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700', marginTop: 12 }}>{item.title}</Text>
      <Text style={{ color: colors.secondary, marginTop: 4 }}>{item.place}</Text>
      <Text style={{ color: colors.text, fontSize: 20, fontWeight: '700', marginVertical: 12 }}>{som(item.price)}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <Pressable onPress={() => setQty((q) => Math.max(1, q - 1))}><Text style={{ fontSize: 28, color: colors.text }}>−</Text></Pressable>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>{qty}</Text>
        <Pressable onPress={() => setQty((q) => q + 1)}><Text style={{ fontSize: 28, color: colors.text }}>+</Text></Pressable>
      </View>
    </Screen>
  )
}

export function CartScreen() {
  const navigation = useNavigation<any>()
  const items = useCart((s) => s.items)
  const setQty = useCart((s) => s.setQty)
  const { colors } = useTheme()
  const total = cartTotal(items)
  return (
    <Screen scroll footer={<Button title="Rasmiylashtirish" disabled={items.length === 0} onPress={() => navigation.navigate('Checkout')} />}>
      <Header title="Savat" onBack={() => navigation.goBack()} />
      <View style={{ gap: 10, marginTop: 12 }}>
        {items.length === 0 ? <Text style={{ color: colors.secondary }}>Savat bo'sh</Text> : null}
        {items.map((item) => (
          <Card key={item.id}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{item.title}</Text>
            <Text style={{ color: colors.secondary }}>{item.place} · {som(item.price)}</Text>
            <View style={{ flexDirection: 'row', gap: 16, marginTop: 8, alignItems: 'center' }}>
              <Pressable onPress={() => setQty(item.id, item.qty - 1)}><Text style={{ fontSize: 22, color: colors.text }}>−</Text></Pressable>
              <Text style={{ color: colors.text, fontWeight: '700' }}>{item.qty}</Text>
              <Pressable onPress={() => setQty(item.id, item.qty + 1)}><Text style={{ fontSize: 22, color: colors.text }}>+</Text></Pressable>
            </View>
          </Card>
        ))}
        <Text style={{ color: colors.text, fontWeight: '700' }}>Jami {som(total)}</Text>
      </View>
    </Screen>
  )
}

export function CheckoutScreen() {
  const navigation = useNavigation<any>()
  const items = useCart((s) => s.items)
  const clear = useCart((s) => s.clear)
  const [pay, setPay] = useState('Naqd pul')
  const [when, setWhen] = useState('Hozir')
  const [note, setNote] = useState("Kuryer uchun izoh: qo'ng'iroq qilmang, eshik oldiga qoldiring")
  const { colors } = useTheme()
  const raw = cartTotal(items) || 113000
  const discount = 22600
  const total = Math.max(raw - discount, 0)
  return (
    <Screen scroll footer={<Button title="Buyurtma berish" onPress={() => { clear(); navigation.navigate('Confirmed', { total }) }} />}>
      <Header title="Rasmiylashtirish" onBack={() => navigation.goBack()} />
      <Text style={{ color: colors.secondary, marginTop: 12, fontWeight: '700' }}>YETKAZISH</Text>
      <Card>
        <Text style={{ color: colors.text, fontWeight: '700' }}>Uy · Mustaqillik ko'chasi, 15</Text>
        <Text style={{ color: colors.secondary }}>4-xonadon, 3-qavat, kod 2468</Text>
      </Card>
      <View style={{ flexDirection: 'row', gap: 8, marginVertical: 8 }}>
        {['Hozir · 30 daq', 'Rejalashtirish'].map((item) => (
          <Pressable key={item} onPress={() => setWhen(item)} style={{ backgroundColor: when === item ? colors.accentSoft : colors.surface, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.text }}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <Field label="IZOH" value={note} onChangeText={setNote} multiline />
      <Text style={{ color: colors.secondary, marginTop: 12, fontWeight: '700' }}>TO'LOV</Text>
      <View style={{ gap: 8, marginTop: 8 }}>
        {['Uzcard •• 4417', 'Click / Payme', 'Naqd pul'].map((item) => (
          <Pressable key={item} onPress={() => setPay(item)} style={{ borderWidth: 1, borderColor: pay === item ? colors.accent : colors.border, borderRadius: 14, padding: 12, backgroundColor: colors.surface }}>
            <Text style={{ color: colors.text, fontWeight: '600' }}>{item}</Text>
            <Text style={{ color: colors.secondary }}>{item === 'Uzcard •• 4417' ? 'Asosiy karta' : item === 'Naqd pul' ? "Kuryerga to'lash" : "Raqamli to'lov"}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={{ color: colors.success, marginTop: 12 }}>WELCOME20 · –{som(discount)}</Text>
      <Text style={{ color: colors.secondary, textDecorationLine: 'line-through' }}>{som(raw)}</Text>
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700' }}>Jami {som(total)}</Text>
    </Screen>
  )
}

export function ConfirmedScreen() {
  const navigation = useNavigation<any>()
  const { colors } = useTheme()
  return (
    <Screen footer={<Button title="Kuzatish" onPress={() => navigation.navigate('Tracking')} />}>
      <View style={{ flex: 1, justifyContent: 'center', gap: 8 }}>
        <Text style={{ color: colors.text, fontSize: 28, fontWeight: '700' }}>Buyurtma qabul qilindi</Text>
        <Text style={{ color: colors.secondary }}>#48213 · restoran tayyorlamoqda</Text>
      </View>
    </Screen>
  )
}

export function TrackingScreen() {
  const navigation = useNavigation<any>()
  const { colors } = useTheme()
  return (
    <Screen map pad={false} footer={<Button title="Yetkazildi" onPress={() => navigation.navigate('Delivered')} />}>
      <CityMap />
      <View style={{ backgroundColor: colors.surface, padding: 16, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '700' }}>Kuryer olib ketdi · ~14 daq</Text>
        <Text style={{ color: colors.secondary }}>Rayhon milliy taomlari · #48213</Text>
      </View>
    </Screen>
  )
}

export function DeliveredScreen() {
  const navigation = useNavigation<any>()
  const [stars, setStars] = useState(5)
  const { colors } = useTheme()
  return (
    <Screen footer={<Button title="Baholash" onPress={() => navigation.navigate('Tabs', { screen: 'Buyurtmalar' })} />}>
      <Header title="Yetkazildi" onBack={() => navigation.goBack()} />
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700', marginVertical: 12 }}>Buyurtmani baholang</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable key={n} onPress={() => setStars(n)}><Text style={{ fontSize: 32, color: n <= stars ? '#D99A28' : colors.border }}>★</Text></Pressable>
        ))}
      </View>
    </Screen>
  )
}

export function CategoryScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const kind = route.params?.kind || 'grocery'
  const catalog = CATALOGS[kind] || CATALOGS.grocery
  const { colors } = useTheme()
  return (
    <Screen scroll>
      <Header title={catalog.title} onBack={() => navigation.goBack()} />
      <View style={{ gap: 10, marginTop: 12 }}>
        {catalog.items.map((item) => (
          <Card key={item.id} onPress={() => navigation.navigate(kind === 'pharmacy' && item.id === 'para' ? 'Medicine' : 'Product', { ...item, kind })}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{item.title}</Text>
            <Text style={{ color: colors.secondary }}>{item.meta}</Text>
            <Text style={{ color: colors.text, marginTop: 4 }}>{som(item.price)}</Text>
          </Card>
        ))}
      </View>
    </Screen>
  )
}

export function ProductScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const add = useCart((s) => s.add)
  const item = route.params || CATALOGS.grocery.items[0]
  const { colors } = useTheme()
  return (
    <Screen footer={<Button title="Savatga" onPress={() => { add({ id: item.id, title: item.title, price: item.price, place: item.meta || 'Market' }); navigation.navigate('Cart') }} />}>
      <Header title={item.title} onBack={() => navigation.goBack()} />
      <Text style={{ color: colors.text, fontSize: 28, fontWeight: '700', marginTop: 16 }}>{som(item.price)}</Text>
      <Text style={{ color: colors.secondary, marginTop: 6 }}>{item.meta}</Text>
    </Screen>
  )
}

export function MedicineScreen() {
  const navigation = useNavigation<any>()
  const add = useCart((s) => s.add)
  const { colors } = useTheme()
  return (
    <Screen footer={<Button title="Savatga" onPress={() => { add({ id: 'para', title: 'Paracetamol 500 mg', price: 8500, place: 'Dorixona №1' }); navigation.navigate('Cart') }} />}>
      <Header title="Paracetamol 500 mg" onBack={() => navigation.goBack()} />
      <View style={{ alignSelf: 'flex-start', backgroundColor: colors.warningSoft, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, marginTop: 12 }}>
        <Text style={{ color: colors.warning, fontWeight: '700' }}>Retsept talab qilinadi</Text>
      </View>
      <Text style={{ color: colors.text, fontSize: 28, fontWeight: '700', marginTop: 12 }}>{som(8500)}</Text>
      <Text style={{ color: colors.secondary, marginTop: 6 }}>Dorixona №1</Text>
    </Screen>
  )
}
