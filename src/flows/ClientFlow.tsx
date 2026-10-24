import { useMemo, useState } from 'react'
import { Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useAuthStore } from '../store/authStore'
import { usePrefs } from '../store/prefsStore'
import { Button, Card, CityMap, Field, Header, Screen } from '../ui/components'
import { useTheme } from '../ui/theme'

function useNav() {
  return useNavigation<any>()
}

const CATEGORIES = [
  { id: 'restaurants', title: 'Restoranlar', badge: '-30%', screen: 'Restaurants' },
  { id: 'market', title: 'Market', screen: 'Category', params: { kind: 'grocery' } },
  { id: 'pharmacy', title: 'Dorixona', screen: 'Category', params: { kind: 'pharmacy' } },
  { id: 'cargo', title: 'Yuk tashish', screen: 'CargoBooking' },
  { id: 'home', title: "Uy-ro'zg'or", screen: 'Category', params: { kind: 'household' } },
  { id: 'electronics', title: 'Elektronika', screen: 'Category', params: { kind: 'electronics' } },
  { id: 'flowers', title: 'Gullar', screen: 'Category', params: { kind: 'flowers' } },
]

const RESTAURANTS = [
  { id: 'rayhon', name: 'Rayhon milliy taomlari', meta: '4.9 · 25–35 daq', fee: 'Bepul yetkazish', kind: 'national' },
  { id: 'burger', name: 'Burger Lab', meta: '4.7 · 20–30 daq', fee: "Yetkazish 5 000", kind: 'fast' },
  { id: 'shashlik', name: 'Shashlik House', meta: '4.8 · 30–40 daq', fee: 'Bepul yetkazish', kind: 'national' },
]

const SEARCH_ITEMS = [
  { title: "Plov · choyxona usulida", meta: "Rayhon · 38 000 so'm", tag: 'Taom', go: 'Restaurant' },
  { title: 'Plov Markazi', meta: 'Restoran · 4.8 · 1.2 km', tag: 'Restoran', go: 'Restaurants' },
  { title: "Guruch Devzira, 1 kg", meta: "Market · 32 000 so'm", tag: 'Market', go: 'Category', params: { kind: 'grocery' } },
  { title: 'Plov markazi, Yunusobod', meta: 'Manzil · 4.6 km', tag: 'Manzil', go: 'Destination' },
]

export function HomeScreen() {
  const navigation = useNav()
  const user = useAuthStore((s) => s.user)
  const lang = usePrefs((s) => s.lang)
  const { colors } = useTheme()
  const name = user?.name || 'Aziz Aliyev'
  return (
    <Screen pad={false} scroll>
      <View style={{ padding: 16, gap: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Text style={{ color: colors.secondary }}>Xayrli kun,</Text>
            <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700' }}>{name}</Text>
          </View>
          <View style={{ backgroundColor: colors.accentSoft, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 }}>
            <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 12 }}>{lang}</Text>
          </View>
        </View>

        <Card onPress={() => navigation.navigate('Destination')}>
          <Text style={{ color: colors.secondary, fontSize: 12 }}>Yetkazish manzili</Text>
          <Text style={{ color: colors.text, fontWeight: '600', marginTop: 2 }}>Mustaqillik ko'chasi, 15 · Uy</Text>
        </Card>

        <Pressable onPress={() => navigation.navigate('Qidiruv')} style={{ backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.border, minHeight: 48, justifyContent: 'center', paddingHorizontal: 14 }}>
          <Text style={{ color: colors.secondary }}>Nima qidiryapsiz?</Text>
        </Pressable>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Pressable onPress={() => navigation.navigate('Destination')} style={{ flex: 1, backgroundColor: colors.accent, borderRadius: 18, padding: 14, minHeight: 108 }}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>Taksi</Text>
            <Text style={{ color: '#DBEAFE', marginTop: 6 }}>2 daqiqada yetib keladi</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('CourierSend')} style={{ flex: 1, backgroundColor: '#172554', borderRadius: 18, padding: 14, minHeight: 108 }}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>Kuryer</Text>
            <Text style={{ color: '#C7D2FE', marginTop: 6 }}>Posilka va hujjat</Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {CATEGORIES.map((item) => (
            <Pressable key={item.id} onPress={() => navigation.navigate(item.screen, item.params)} style={{ backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 10 }}>
              <Text style={{ color: colors.text, fontWeight: '600' }}>{item.title}</Text>
              {item.badge ? <Text style={{ color: colors.error, fontSize: 12, fontWeight: '700' }}>{item.badge}</Text> : null}
            </Pressable>
          ))}
          <Pressable onPress={() => navigation.navigate('Services')} style={{ backgroundColor: colors.accentSoft, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, justifyContent: 'center' }}>
            <Text style={{ color: colors.accent, fontWeight: '700' }}>Barchasi</Text>
          </Pressable>
        </ScrollView>

        <Card onPress={() => navigation.navigate('DriverFound')}>
          <Text style={{ color: colors.success, fontWeight: '700' }}>Haydovchi 3 daqiqada keladi</Text>
          <Text style={{ color: colors.text, marginTop: 4 }}>Chevrolet Cobalt · 01 A 777 BA</Text>
        </Card>

        <Pressable onPress={() => navigation.navigate('Restaurant', { id: 'rayhon' })} style={{ backgroundColor: '#172554', borderRadius: 20, padding: 16 }}>
          <Text style={{ color: '#93C5FD', fontWeight: '700', fontSize: 12 }}>Faqat bugun</Text>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700', marginTop: 6 }}>Plov uchun{'\n'}–30% chegirma</Text>
          <Text style={{ color: '#E2E8F0', marginTop: 8 }}>Rayhon milliy taomlari</Text>
        </Pressable>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: colors.text, fontSize: 17, fontWeight: '700' }}>Mashhur restoranlar</Text>
          <Pressable onPress={() => navigation.navigate('Restaurants')}><Text style={{ color: colors.accent, fontWeight: '600' }}>Barchasi</Text></Pressable>
        </View>
        {RESTAURANTS.map((place) => (
          <Card key={place.id} onPress={() => navigation.navigate('Restaurant', { id: place.id })}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{place.name}</Text>
            <Text style={{ color: colors.secondary, marginTop: 4 }}>{place.meta}</Text>
            <Text style={{ color: colors.success, marginTop: 4 }}>{place.fee}</Text>
          </Card>
        ))}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: colors.text, fontSize: 17, fontWeight: '700' }}>Yaqinda buyurtma qilingan</Text>
          <Pressable onPress={() => navigation.navigate('Buyurtmalar')}><Text style={{ color: colors.accent, fontWeight: '600' }}>Barchasi</Text></Pressable>
        </View>
        <Card onPress={() => navigation.navigate('Tracking')}>
          <Text style={{ color: colors.text, fontWeight: '600' }}>Go'shtli somsa × 4</Text>
          <Text style={{ color: colors.secondary, marginTop: 4 }}>Kecha · Somsa Markazi</Text>
        </Card>
        <Card onPress={() => navigation.navigate('Medicine')}>
          <Text style={{ color: colors.text, fontWeight: '600' }}>Paracetamol 500 mg</Text>
          <Text style={{ color: colors.secondary, marginTop: 4 }}>3 kun oldin · Dorixona №1</Text>
        </Card>
      </View>
    </Screen>
  )
}

export function SearchScreen() {
  const navigation = useNav()
  const { colors } = useTheme()
  const [query, setQuery] = useState('plov')
  const [tab, setTab] = useState('Barchasi')
  const tabs = ['Barchasi', 'Taomlar', 'Restoranlar', 'Market']
  const items = useMemo(() => SEARCH_ITEMS.filter((item) => {
    const hit = item.title.toLowerCase().includes(query.toLowerCase()) || query.length === 0
    if (tab === 'Barchasi') return hit
    if (tab === 'Taomlar') return hit && item.tag === 'Taom'
    if (tab === 'Restoranlar') return hit && item.tag === 'Restoran'
    return hit && item.tag === 'Market'
  }), [query, tab])
  return (
    <Screen pad={false} scroll>
      <View style={{ padding: 16, gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <TextInput value={query} onChangeText={setQuery} style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.border, minHeight: 48, paddingHorizontal: 14, color: colors.text }} />
          <Pressable onPress={() => setQuery('')}><Text style={{ color: colors.accent, fontWeight: '600' }}>Bekor</Text></Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {tabs.map((item) => (
            <Pressable key={item} onPress={() => setTab(item)} style={{ backgroundColor: tab === item ? colors.accent : colors.surface, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ color: tab === item ? '#fff' : colors.text, fontWeight: '600' }}>{item}</Text>
            </Pressable>
          ))}
        </ScrollView>
        {items.map((item) => (
          <Card key={item.title} onPress={() => navigation.navigate(item.go, item.params)}>
            <Text style={{ color: colors.accent, fontSize: 12, fontWeight: '700' }}>{item.tag}</Text>
            <Text style={{ color: colors.text, fontWeight: '700', marginTop: 4 }}>{item.title}</Text>
            <Text style={{ color: colors.secondary, marginTop: 2 }}>{item.meta}</Text>
          </Card>
        ))}
        <Text style={{ color: colors.text, fontWeight: '700', marginTop: 8 }}>Oxirgi qidiruvlar</Text>
        <Text style={{ color: colors.secondary }}>Lavash · Paracetamol · Sut 1 l · Gullar · Burger Lab</Text>
        <Text style={{ color: colors.text, fontWeight: '700' }}>Trendda</Text>
        <Text style={{ color: colors.secondary }}>Double burger · 42 000 so'm</Text>
        <Text style={{ color: colors.secondary }}>Fresh apelsin · 18 000 so'm</Text>
        <Text style={{ color: colors.secondary }}>Sezar salat · 36 000 so'm</Text>
      </View>
    </Screen>
  )
}

export function ServicesScreen() {
  const navigation = useNav()
  const { colors } = useTheme()
  const all: { title: string; text: string; go: string; params?: { kind: string } }[] = [
    { title: 'Taksi', text: '2 daqiqada yetib keladi', go: 'Destination' },
    { title: 'Kuryer', text: 'Posilka va hujjat', go: 'CourierSend' },
    ...CATEGORIES.map((item) => ({ title: item.title, text: item.badge || 'Ochish', go: item.screen, params: item.params })),
  ]
  return (
    <Screen scroll>
      <Header title="Barcha xizmatlar" onBack={() => navigation.goBack()} />
      <View style={{ gap: 10, marginTop: 12 }}>
        {all.map((item) => (
          <Card key={item.title} onPress={() => navigation.navigate(item.go, item.params)}>
            <Text style={{ color: colors.text, fontWeight: '700', fontSize: 16 }}>{item.title}</Text>
            <Text style={{ color: colors.secondary, marginTop: 4 }}>{item.text}</Text>
          </Card>
        ))}
      </View>
    </Screen>
  )
}

export function NotificationsScreen() {
  const navigation = useNav()
  const { colors } = useTheme()
  const items = [
    { title: 'Haydovchi yo\'lda', text: 'Komfort · 3 daqiqa', time: 'Hozir' },
    { title: 'Buyurtma qabul qilindi', text: 'Rayhon milliy taomlari · #48213', time: '14:20' },
    { title: 'Faqat bugun', text: 'Plov uchun –30% chegirma', time: 'Kecha' },
  ]
  return (
    <Screen scroll>
      <Header title="Bildirishnomalar" onBack={() => navigation.goBack()} />
      <View style={{ gap: 10, marginTop: 12 }}>
        {items.map((item) => (
          <Card key={item.title}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{item.title}</Text>
            <Text style={{ color: colors.secondary, marginTop: 4 }}>{item.text}</Text>
            <Text style={{ color: colors.secondary, marginTop: 6, fontSize: 12 }}>{item.time}</Text>
          </Card>
        ))}
      </View>
    </Screen>
  )
}

export function OrdersScreen() {
  const navigation = useNav()
  const { colors } = useTheme()
  const [tab, setTab] = useState('Faol')
  const tabs = ['Faol (2)', 'Tarix', 'Rejalashtirilgan']
  return (
    <Screen scroll>
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700' }}>Buyurtmalar</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginVertical: 12 }}>
        {tabs.map((item) => {
          const active = tab === item.split(' ')[0] || (item.startsWith('Faol') && tab === 'Faol')
          const key = item.startsWith('Faol') ? 'Faol' : item
          return (
            <Pressable key={item} onPress={() => setTab(key)} style={{ backgroundColor: tab === key ? colors.accent : colors.surface, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ color: tab === key ? '#fff' : colors.text, fontWeight: '600' }}>{item}</Text>
            </Pressable>
          )
        })}
      </View>
      {tab === 'Faol' ? (
        <View style={{ gap: 10 }}>
          <Card onPress={() => navigation.navigate('Tracking')}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>Rayhon milliy taomlari</Text>
            <Text style={{ color: colors.secondary, marginTop: 4 }}>#48213 · 3 ta mahsulot · 71 000 so'm</Text>
            <Text style={{ color: colors.accent, marginTop: 4 }}>Kuryer olib ketdi · ~14 daq</Text>
          </Card>
          <Card onPress={() => navigation.navigate('LiveRide')}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>Taksi · Komfort</Text>
            <Text style={{ color: colors.accent, marginTop: 4 }}>Haydovchi yo'lda · 3 daq</Text>
          </Card>
        </View>
      ) : null}
      {tab === 'Tarix' ? (
        <View style={{ gap: 10 }}>
          <HistoryRow title="Dorixona №1" meta="Kecha · 2 ta mahsulot" price="28 500 so'm" status="Yetkazildi" />
          <HistoryRow title="Yuk · Divan" meta="12-sentabr · Isuzu NPR" price="240 000 so'm" status="Bajarildi" />
          <HistoryRow title="Burger Lab" meta="10-sentabr" price="42 000 so'm" status="Bekor qilindi" />
        </View>
      ) : null}
      {tab === 'Rejalashtirilgan' ? <Text style={{ color: colors.secondary }}>Rejalashtirilgan buyurtma yo'q. Sana tanlash oynasi dizaynda alohida kadr emas.</Text> : null}
    </Screen>
  )
}

function HistoryRow({ title, meta, price, status }: { title: string; meta: string; price: string; status: string }) {
  const { colors } = useTheme()
  const color = status === 'Bekor qilindi' ? colors.error : colors.success
  return (
    <Card>
      <Text style={{ color: colors.secondary, fontSize: 12, fontWeight: '700' }}>OLDINGI BUYURTMALAR</Text>
      <Text style={{ color: colors.text, fontWeight: '700', marginTop: 4 }}>{title}</Text>
      <Text style={{ color: colors.secondary }}>{meta}</Text>
      <Text style={{ color: colors.text, marginTop: 4 }}>{price}</Text>
      <Text style={{ color, fontWeight: '700', marginTop: 4 }}>{status}</Text>
    </Card>
  )
}

export function SettingsScreen() {
  const navigation = useNav()
  const { colors } = useTheme()
  const dark = usePrefs((s) => s.dark)
  const toggleDark = usePrefs((s) => s.toggleDark)
  const lang = usePrefs((s) => s.lang)
  const setLang = usePrefs((s) => s.setLang)
  const [share, setShare] = useState(true)
  const [push, setPush] = useState(true)
  const [promo, setPromo] = useState(false)
  return (
    <Screen scroll>
      <Header title="Sozlamalar" onBack={() => navigation.goBack()} />
      <Text style={{ color: colors.secondary, marginTop: 16, fontWeight: '700' }}>UMUMIY</Text>
      <Text style={{ color: colors.text, marginTop: 10 }}>Ilova tili</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
        {(['UZ', 'RU'] as const).map((item) => (
          <Pressable key={item} onPress={() => setLang(item)} style={{ backgroundColor: lang === item ? colors.accent : colors.surface, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: lang === item ? '#fff' : colors.text, fontWeight: '700' }}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <SettingSwitch title="Qorong'i rejim" text="Kechasi ko'zni charchatmaydi" value={dark} onValueChange={toggleDark} />
      <Card><Text style={{ color: colors.text, fontWeight: '600' }}>Xarita uslubi</Text><Text style={{ color: colors.secondary }}>Avtomatik</Text></Card>
      <Text style={{ color: colors.secondary, marginTop: 16, fontWeight: '700' }}>XAVFSIZLIK</Text>
      <Card><Text style={{ color: colors.text }}>Parolni o'zgartirish</Text></Card>
      <Card><Text style={{ color: colors.text }}>Favqulodda kontaktlar</Text><Text style={{ color: colors.secondary }}>2 ta kontakt</Text></Card>
      <SettingSwitch title="Safarni avtomatik ulashish" text="Tungi safarlarda" value={share} onValueChange={setShare} />
      <Text style={{ color: colors.secondary, marginTop: 16, fontWeight: '700' }}>XABARNOMALAR</Text>
      <SettingSwitch title="Push xabarlar" text="Buyurtma holati" value={push} onValueChange={setPush} />
      <SettingSwitch title="Aksiyalar" text="SMS va push" value={promo} onValueChange={setPromo} />
    </Screen>
  )
}

function SettingSwitch({ title, text, value, onValueChange }: { title: string; text: string; value: boolean; onValueChange: (v: boolean) => void }) {
  const { colors } = useTheme()
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontWeight: '600' }}>{title}</Text>
        <Text style={{ color: colors.secondary }}>{text}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  )
}

export function ProfileScreen() {
  const navigation = useNav()
  const logout = useAuthStore((s) => s.logout)
  const user = useAuthStore((s) => s.user)
  const { colors } = useTheme()
  const rows = [
    { title: 'Buyurtmalar', go: 'Buyurtmalar' },
    { title: 'Bildirishnomalar', go: 'Notifications' },
    { title: 'Sozlamalar', go: 'Settings' },
    { title: 'Yetkazish manzili', go: 'Destination' },
  ]
  return (
    <Screen scroll footer={<Button title="Chiqish" variant="danger" onPress={logout} />}>
      <Text style={{ color: colors.secondary }}>Xayrli kun,</Text>
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700' }}>{user?.name || 'Aziz Aliyev'}</Text>
      <Text style={{ color: colors.secondary, marginBottom: 12 }}>{user?.phone}</Text>
      <Card>
        <Text style={{ color: colors.secondary, fontSize: 12 }}>Yetkazish manzili</Text>
        <Text style={{ color: colors.text, fontWeight: '600' }}>Mustaqillik ko'chasi, 15 · Uy</Text>
      </Card>
      <View style={{ gap: 10, marginTop: 12 }}>
        {rows.map((row) => (
          <Card key={row.title} onPress={() => navigation.navigate(row.go)}>
            <Text style={{ color: colors.text, fontWeight: '600' }}>{row.title}</Text>
          </Card>
        ))}
      </View>
    </Screen>
  )
}

export function MapTabScreen() {
  const navigation = useNav()
  return (
    <Screen pad={false} map>
      <View style={{ flex: 1 }}>
        <View style={{ padding: 16 }}>
          <Pressable onPress={() => navigation.navigate('Destination')} style={{ backgroundColor: '#fff', borderRadius: 14, minHeight: 48, justifyContent: 'center', paddingHorizontal: 14 }}>
            <Text style={{ color: '#64748B' }}>Qayerga boramiz?</Text>
          </Pressable>
        </View>
        <CityMap />
        <View style={{ padding: 16 }}>
          <Button title="Taksi chaqirish" onPress={() => navigation.navigate('Destination')} />
        </View>
      </View>
    </Screen>
  )
}

export function CourierSendScreen() {
  const navigation = useNav()
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)
  const { colors } = useTheme()
  if (sent) {
    return (
      <Screen footer={<Button title="Buyurtmalarga" onPress={() => navigation.navigate('Buyurtmalar')} />}>
        <View style={{ flex: 1, justifyContent: 'center', gap: 8 }}>
          <Text style={{ color: colors.text, fontSize: 28, fontWeight: '700' }}>Kuryer chiqdi</Text>
          <Text style={{ color: colors.secondary }}>Mustaqillik ko'chasi, 15 dan Toshkent City Mall ga.</Text>
        </View>
      </Screen>
    )
  }
  return (
    <Screen scroll footer={<Button title="Kuryer chaqirish" onPress={() => setSent(true)} />}>
      <Header title="Kuryer" onBack={() => navigation.goBack()} />
      <Text style={{ color: colors.secondary, marginVertical: 8 }}>Posilka va hujjat. Qayerdan va qayerga.</Text>
      <View style={{ gap: 12 }}>
        <Card><Text style={{ color: colors.secondary }}>Qayerdan</Text><Text style={{ color: colors.text, fontWeight: '600' }}>Mustaqillik ko'chasi, 15</Text></Card>
        <Card onPress={() => navigation.navigate('Destination')}><Text style={{ color: colors.secondary }}>Qayerga</Text><Text style={{ color: colors.text, fontWeight: '600' }}>Toshkent City Mall</Text></Card>
        <Field label="Nima yuboriladi" value={note} onChangeText={setNote} placeholder="Hujjat, quti, kalit" multiline />
      </View>
    </Screen>
  )
}
