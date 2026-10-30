import { useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useAuthStore } from '../store/authStore'
import { usePrefs } from '../store/prefsStore'
import { Button, Card, CityMap, Field, Header, Screen } from '../ui/components'
import { som, useTheme } from '../ui/theme'

function useNav() {
  return useNavigation<any>()
}

function Title({ title, text }: { title: string; text?: string }) {
  const { colors } = useTheme()
  return (
    <View style={{ gap: 8, marginTop: 12 }}>
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700' }}>{title}</Text>
      {text ? <Text style={{ color: colors.secondary, lineHeight: 22 }}>{text}</Text> : null}
    </View>
  )
}

export function LanguageScreen() {
  const navigation = useNav()
  const lang = usePrefs((s) => s.lang)
  const setLang = usePrefs((s) => s.setLang)
  const { colors } = useTheme()
  return (
    <Screen footer={<Button title="Davom etish" onPress={() => navigation.replace('Welcome')} />}>
      <Title title="Tilni tanlang" />
      <View style={{ gap: 10, marginTop: 20 }}>
        {([['UZ', "O'zbekcha"], ['RU', 'Русский']] as const).map(([id, label]) => (
          <Pressable key={id} onPress={() => setLang(id)} style={{ borderRadius: 16, borderWidth: 1, borderColor: lang === id ? colors.accent : colors.border, backgroundColor: colors.surface, padding: 16 }}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{label}</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  )
}

export function PhoneOtpScreen() {
  const navigation = useNav()
  const [phone, setPhone] = useState('90 123 45 67')
  const [error, setError] = useState('')
  const { colors } = useTheme()
  return (
    <Screen footer={<Button title="Kod olish" onPress={() => {
      if (phone.replace(/\D/g, '').length < 9) {
        setError("Raqamni to'liq kiriting")
        return
      }
      navigation.navigate('SmsCode')
    }} />}>
      <Header title="Telefon raqamingiz" onBack={() => navigation.goBack()} />
      <Text style={{ color: colors.secondary, marginTop: 8 }}>+998 qulflangan. Faqat O'zbekiston raqami.</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16 }}>
        <Text style={{ color: colors.text, fontWeight: '800', fontSize: 18 }}>+998</Text>
        <TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={{ flex: 1, minHeight: 52, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 12, backgroundColor: colors.surface, color: colors.text }} />
      </View>
      {error ? <Text style={{ color: colors.error, marginTop: 8 }}>{error}</Text> : null}
    </Screen>
  )
}

export function SmsCodeScreen() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigation = useNav()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  return (
    <Screen footer={<Button title="Kirish" onPress={() => {
      if (code.trim().length < 6) {
        setError('6 xonali kod kiriting')
        return
      }
      setAuth('demo', { id: 'u1', name: 'Eldor Komilov', phone: '+998 90 123 45 67' })
    }} />}>
      <Header title="SMS-kodni kiriting" onBack={() => navigation.goBack()} />
      <Title title="6 xona" text="Hozircha istalgan 6 raqam ochadi. Qayta yuborish 00:42 dan keyin." />
      <Field label="Kod" value={code} onChangeText={(v) => { setCode(v.replace(/\D/g, '').slice(0, 6)); setError('') }} keyboard="number-pad" error={error} />
    </Screen>
  )
}

export function NotifyPermissionScreen() {
  const navigation = useNav()
  return (
    <Screen footer={
      <View style={{ gap: 8 }}>
        <Button title="Ruxsat berish" onPress={() => navigation.goBack()} />
        <Button title="Hozir emas" variant="ghost" onPress={() => navigation.goBack()} />
      </View>
    }>
      <Title title="Bildirishnomalarga ruxsat bering" text="Haydovchi kelganda, narx o'zgarganda va buyurtma holatida xabar olasiz." />
    </Screen>
  )
}

export function BlockedScreen() {
  return (
    <Screen footer={<Button title="Qo'llab-quvvatlash" />}>
      <Title title="Akkaunt bloklangan" text="ACCOUNT_BLOCKED. Bu holatda buyurtma berilmaydi." />
    </Screen>
  )
}

export function UpgradeScreen() {
  return (
    <Screen footer={<Button title="Yangilash" />}>
      <Title title="Ilovani yangilang" text="UPGRADE_REQUIRED. Bu versiya endi buyurtma qabul qilmaydi." />
    </Screen>
  )
}

export function TaxiTimeoutScreen() {
  const navigation = useNav()
  return (
    <Screen map pad={false} footer={
      <View style={{ gap: 8 }}>
        <Button title="Qayta qidirish" onPress={() => navigation.replace('Searching')} />
        <Button title="Bekor qilish" variant="ghost" onPress={() => navigation.popToTop()} />
      </View>
    }>
      <CityMap />
      <View style={{ backgroundColor: '#fff', padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>Haydovchi topilmadi</Text>
        <Text style={{ color: '#64748B', marginTop: 6 }}>Hozir yaqin atrofda bo'sh mashina yo'q.</Text>
      </View>
    </Screen>
  )
}

export function OutOfAreaScreen() {
  const navigation = useNav()
  return (
    <Screen map pad={false} footer={<Button title="Boshqa manzil tanlash" onPress={() => navigation.navigate('Destination')} />}>
      <CityMap />
      <View style={{ backgroundColor: '#fff', padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>Bu manzil xizmat hududidan tashqarida</Text>
        <Text style={{ color: '#64748B', marginTop: 6 }}>Manzil shahar tashqarisida. Boshqa nuqtani tanlang.</Text>
      </View>
    </Screen>
  )
}

export function CancelRideScreen() {
  const navigation = useNav()
  const { colors } = useTheme()
  const reasons = ["Rejam o'zgardi", 'Kutish uzoq', "Haydovchi so'radi", 'Xato manzil', 'Boshqa']
  const [reason, setReason] = useState(reasons[0])
  return (
    <Screen scroll footer={
      <View style={{ gap: 8 }}>
        <Button title="Bekor qilish" variant="danger" onPress={() => navigation.popToTop()} />
        <Button title="Bekor qilmaslik" variant="ghost" onPress={() => navigation.goBack()} />
      </View>
    }>
      <Header title="Buyurtmani bekor qilasizmi?" onBack={() => navigation.goBack()} />
      <Card><Text style={{ color: colors.warning, fontWeight: '700' }}>Haydovchi allaqachon yo'lda.</Text></Card>
      <Text style={{ color: colors.secondary, marginVertical: 8 }}>Sababini tanlang</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {reasons.map((item) => (
          <Pressable key={item} onPress={() => setReason(item)} style={{ backgroundColor: reason === item ? colors.navy : colors.surface, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: reason === item ? '#fff' : colors.text }}>{item}</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  )
}

export function DriverCancelledScreen() {
  const navigation = useNav()
  return (
    <Screen footer={
      <View style={{ gap: 8 }}>
        <Button title="Taksi chaqirish" onPress={() => navigation.replace('Searching')} />
        <Button title="Oldingi bekor qilish" variant="ghost" onPress={() => navigation.popToTop()} />
      </View>
    }>
      <Title title="Boshqa haydovchi qidirilmoqda" text="Haydovchi buyurtmani bekor qildi. Yangi haydovchi qidiriladi." />
    </Screen>
  )
}

export function RideOfflineScreen() {
  const navigation = useNav()
  return (
    <Screen footer={<Button title="Qayta urinish" onPress={() => navigation.goBack()} />}>
      <Title title="Aloqa yo'q, qayta ulanmoqda" text="Haydovchi 3 daqiqada keladi. Oq Cobalt · 20 A 123 BC. Safar holati saqlanadi." />
    </Screen>
  )
}

export function LocationPermissionScreen() {
  const navigation = useNav()
  return (
    <Screen footer={
      <View style={{ gap: 8 }}>
        <Button title="Sozlamalarni ochish" onPress={() => navigation.goBack()} />
        <Button title="Qayta urinish" variant="secondary" onPress={() => navigation.goBack()} />
        <Button title="Xaritada tanlash" variant="ghost" onPress={() => navigation.navigate('PinLandmark')} />
      </View>
    }>
      <Title title="Joylashuvga ruxsat berilmagan" text="Qayerdan olib ketishni ko'rsatish uchun joylashuv kerak. Ruxsatsiz pin va mo'ljal bilan davom etiladi." />
    </Screen>
  )
}

export function PinLandmarkScreen() {
  const navigation = useNav()
  const [pin, setPin] = useState('Bozor darvozasi, do\'konlar qarshisida')
  return (
    <Screen map pad={false} footer={<Button title="Tasdiqlash" onPress={() => navigation.navigate('Tariffs', { to: pin })} />}>
      <CityMap />
      <View style={{ backgroundColor: '#fff', padding: 16, gap: 8 }}>
        <Text style={{ fontWeight: '700' }}>Qayerdan olib ketamiz?</Text>
        <Text style={{ color: '#64748B' }}>Yangiyer bozori yonida</Text>
        <TextInput value={pin} onChangeText={setPin} style={{ minHeight: 48, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 12 }} />
      </View>
    </Screen>
  )
}

export function PriceChangedScreen() {
  const navigation = useNav()
  return (
    <Screen footer={
      <View style={{ gap: 8 }}>
        <Button title="Tasdiqlash" onPress={() => navigation.goBack()} />
        <Button title="Bekor qilish" variant="ghost" onPress={() => navigation.navigate('CancelRide')} />
      </View>
    }>
      <Title title="Narx o'zgardi" text={`${som(18000)} edi. Davom etish uchun yangi narx ${som(20000)}.`} />
    </Screen>
  )
}

export function ChatScreen() {
  const navigation = useNav()
  const { colors } = useTheme()
  const quick = ['Chiqyapman', '5 daqiqa kuting', 'Qayerdasiz?', 'Yetib keldim, do\'kon darvozasida kutaman']
  const [messages, setMessages] = useState<string[]>(['2 daqiqada chiqaman'])
  const [text, setText] = useState('')
  return (
    <Screen scroll footer={
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput value={text} onChangeText={setText} placeholder="Xabar yozing" style={{ flex: 1, minHeight: 48, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 12, color: colors.text }} />
        <Button title="Yubor" onPress={() => { if (text.trim()) { setMessages((list) => [...list, text.trim()]); setText('') } }} />
      </View>
    }>
      <Header title="Eldor K. · haydovchi" onBack={() => navigation.goBack()} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
        {quick.map((item) => (
          <Pressable key={item} onPress={() => setMessages((list) => [...list, item])} style={{ backgroundColor: colors.accentSoft, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 8 }}>
            <Text style={{ color: colors.accent }}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <View style={{ gap: 8, marginTop: 12 }}>
        {messages.map((item) => <Card key={item}><Text style={{ color: colors.text }}>{item}</Text></Card>)}
      </View>
    </Screen>
  )
}

export function SosScreen() {
  const navigation = useNav()
  const [sent, setSent] = useState(false)
  const { colors } = useTheme()
  return (
    <Screen footer={<Button title={sent ? 'Yopish' : 'Bosib turing — 2 soniya'} variant="danger" onPress={() => setSent(true)} />}>
      <Header title="Favqulodda yordam" onBack={() => navigation.goBack()} />
      <Title title={sent ? 'Xabar ketdi' : 'SOS'} text="112, 102 va 103. Zoomer operatoriga joylashuv, haydovchi va mashina raqami boradi." />
      <Text style={{ color: colors.secondary, marginTop: 8 }}>Cobalt · 01 A 777 BA</Text>
    </Screen>
  )
}

const WAIT = ['free', 'clock', 'paid', 'stop', 'receipt'] as const

export function FreeWaitScreen() {
  const navigation = useNav()
  const { colors } = useTheme()
  const [step, setStep] = useState<(typeof WAIT)[number]>('free')
  if (step === 'clock') {
    return (
      <Screen footer={<Button title="Pullik kutishni ko'rish" onPress={() => setStep('paid')} />}>
        <Text style={{ color: colors.secondary }}>Payshanba, 22-oktabr</Text>
        <Text style={{ color: colors.text, fontSize: 56, fontWeight: '800' }}>14:41</Text>
        <Card><Text style={{ fontWeight: '700' }}>Pullik kutish boshlandi</Text><Text style={{ color: colors.secondary }}>Har daqiqa 550 so'm. Vaqtni qisqartirish mumkin.</Text></Card>
        <Card><Text style={{ fontWeight: '700' }}>3 daqiqa bepul vaqt qoldi</Text><Text style={{ color: colors.secondary }}>Bekor qilish davomida pullik hisoblanadi.</Text></Card>
      </Screen>
    )
  }
  if (step === 'paid') {
    return (
      <Screen footer={<Button title="Chiqdim — ketdik" onPress={() => setStep('stop')} />}>
        <Title title="Bepul vaqt tugadi" text="Haydovchi hali ham kutyapti. Pullik kutish 02:15 · +1 100 so'm · 550 so'm/daqiqa." />
        <Card><Text>Safar narxi 19 000</Text><Text>Kutish +1 100</Text><Text style={{ fontWeight: '800' }}>Hozirgi jami 20 100 so'm</Text></Card>
      </Screen>
    )
  }
  if (step === 'stop') {
    return (
      <Screen footer={<Button title="To'xtashni so'rash" onPress={() => setStep('receipt')} />}>
        <Title title="Yo'lda to'xtash" />
        <Card><Text style={{ fontWeight: '700' }}>Do'konga kirib chiqaman</Text><Text style={{ color: colors.secondary }}>10 daqiqa kutish bepul qoladi</Text></Card>
        <Card><Text style={{ fontWeight: '700' }}>Bankomatdan pul yechaman</Text><Text style={{ color: colors.secondary }}>Narxga 550 so'm qo'shiladi</Text></Card>
      </Screen>
    )
  }
  if (step === 'receipt') {
    return (
      <Screen footer={<Button title="Baholash" onPress={() => navigation.navigate('Rating')} />}>
        <Title title="Yetib keldingiz!" text="20 100 so'm · Naqd · Komfort" />
        <Card>
          <Text>Yo'l haqi 4.2 km · 14 daq · 19 000</Text>
          <Text>Pullik kutish 02:15 · +1 100</Text>
          <Text style={{ fontWeight: '800' }}>Jami 20 100 so'm</Text>
        </Card>
        <Text style={{ color: colors.error, marginTop: 8 }}>Kutish noto'g'ri hisoblandi mi? Shikoyat qilish</Text>
      </Screen>
    )
  }
  return (
    <Screen map pad={false} footer={<Button title="Chiqyapman" onPress={() => setStep('clock')} />}>
      <CityMap />
      <View style={{ backgroundColor: colors.surface, padding: 16, gap: 4 }}>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '700' }}>Haydovchi sizni kutyapti</Text>
        <Text style={{ color: colors.secondary }}>Mustaqillik ko'chasi, 15 · Salon oldida</Text>
        <Text style={{ color: colors.text, fontSize: 36, fontWeight: '800' }}>8:42</Text>
        <Text style={{ color: colors.secondary }}>10 daqiqadan shuncha qoldi. Keyin har daqiqa 550 so'm. Vaqtni haydovchi emas, ilova hisoblaydi.</Text>
        <Text style={{ color: colors.text, fontWeight: '700' }}>Sherzod · 4.92 · Cobalt oq · 01 777 BA</Text>
      </View>
    </Screen>
  )
}

export function NothingFoundScreen() {
  const navigation = useNav()
  return (
    <Screen footer={<Button title="Xaritadan tanlash" onPress={() => navigation.navigate('PinLandmark')} />}>
      <Title title="Hech narsa topilmadi" text="Qayerga? Yangiyer 7-mikrorayon. Boshqa so'z yoki xaritadan nuqta tanlang." />
    </Screen>
  )
}

export function HandoverCodeScreen() {
  const navigation = useNav()
  const { colors } = useTheme()
  return (
    <Screen footer={<Button title="Ulashish" variant="secondary" onPress={() => navigation.navigate('DeliveryTrack')} />}>
      <Header title="Buyurtma #4821" onBack={() => navigation.goBack()} />
      <Text style={{ color: colors.secondary, marginTop: 8 }}>Topshirish kodi. Kodni faqat oluvchiga ayting.</Text>
      <Text style={{ color: colors.text, fontSize: 40, fontWeight: '800', letterSpacing: 8, marginTop: 16 }}>4819</Text>
      <Card><Text style={{ color: colors.warning }}>Operator yangi kod berdi. Eski kod endi ishlamaydi.</Text></Card>
      <Text style={{ color: colors.secondary }}>Kuryer posilkani olishga ketmoqda.</Text>
    </Screen>
  )
}

export function DeliveryTrackScreen() {
  const navigation = useNav()
  const { colors } = useTheme()
  const steps = ['Qabul qilindi · 14:02', 'Kuryer oldi', "Yo'lda", 'Topshirildi']
  return (
    <Screen scroll footer={<Button title="Nizo ochish" variant="secondary" onPress={() => navigation.goBack()} />}>
      <Header title="Buyurtma #4821" onBack={() => navigation.goBack()} />
      {steps.map((step) => <Card key={step}><Text style={{ color: colors.text, fontWeight: '700' }}>{step}</Text></Card>)}
      <Card><Text style={{ color: colors.warning, fontWeight: '700' }}>Posilka sizga qaytmoqda</Text><Text style={{ color: colors.secondary }}>Qabul qiluvchi topilmadi.</Text></Card>
    </Screen>
  )
}

export function CourierMissingScreen() {
  const navigation = useNav()
  const { colors } = useTheme()
  return (
    <Screen scroll footer={
      <View style={{ gap: 8 }}>
        <Button title="Qayta qidirish" onPress={() => navigation.navigate('CourierSend')} />
        <Button title="Bekor qilish" variant="ghost" onPress={() => navigation.popToTop()} />
      </View>
    }>
      <Header title="Posilka jo'natish" onBack={() => navigation.goBack()} />
      <Card><Text style={{ color: colors.error }}>Telefon +998 91 234 — raqam to'liq emas</Text></Card>
      <Card><Text style={{ color: colors.error }}>Qabul qiluvchi topilmadi</Text></Card>
      <Card><Text style={{ color: colors.error }}>50 000 000 so'm chegaradan yuqori</Text></Card>
      <Title title="Kuryer topilmadi" text="Qayta qidirish yoki buyurtmani bekor qilish." />
    </Screen>
  )
}

export function DeliveryHomeScreen() {
  const navigation = useNav()
  const { colors } = useTheme()
  const items = [
    { title: 'Kuryer', text: 'Posilka va hujjat', go: 'CourierSend' },
    { title: 'Restoran', text: 'Ovqat', go: 'Restaurants' },
    { title: 'Market', text: "Oziq-ovqat", go: 'Category', params: { kind: 'grocery' } },
    { title: 'Dorixona', text: 'Dori', go: 'Category', params: { kind: 'pharmacy' } },
    { title: 'Peregon', text: 'Mashinani haydab borish', go: 'Peregon' },
    { title: 'Shaharlararo', text: "O'z narxingiz", go: 'Intercity' },
    { title: 'Hamkorlar', text: 'Usta va servis', go: 'PartnerServices' },
  ]
  return (
    <Screen scroll>
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700' }}>Yetkazish</Text>
      <View style={{ gap: 10, marginTop: 12 }}>
        {items.map((item) => (
          <Card key={item.title} onPress={() => navigation.navigate(item.go, item.params)}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{item.title}</Text>
            <Text style={{ color: colors.secondary }}>{item.text}</Text>
          </Card>
        ))}
      </View>
    </Screen>
  )
}

export function PeregonScreen() {
  const navigation = useNav()
  const { colors } = useTheme()
  const [step, setStep] = useState<'order' | 'car'>('order')
  const [who, setWho] = useState('Faqat mashina')
  if (step === 'car') {
    return (
      <Screen scroll footer={<Button title="Saqlash va davom etish" onPress={() => navigation.navigate('PeregonStatus')} />}>
        <Header title="Mening mashinam" onBack={() => setStep('order')} />
        <Text style={{ color: colors.secondary }}>Bir marta kiritiladi, keyin eslab qoladi.</Text>
        <Card><Text style={{ fontWeight: '700' }}>Chevrolet Cobalt, 2022 · oq</Text><Text>01 A 777 BB</Text></Card>
        <Text style={{ color: colors.secondary }}>Uzatma: Avtomat · Mexanik · Robot · CVT</Text>
        <Card><Text>Texpasport yuklandi</Text><Text style={{ color: colors.secondary }}>Ishonchnoma ixtiyoriy</Text></Card>
        <Text style={{ color: colors.warning }}>Mashinada qimmatbaho buyum qoldirmang.</Text>
      </Screen>
    )
  }
  return (
    <Screen map pad={false} scroll={false} footer={<Button title="Haydovchi chaqirish · 45 000 so'm" onPress={() => setStep('car')} />}>
      <CityMap />
      <View style={{ backgroundColor: colors.surface, padding: 16, gap: 6 }}>
        <Text style={{ fontWeight: '800', fontSize: 18 }}>Peregon</Text>
        <Text style={{ color: colors.secondary }}>Mashina manzili · Mustaqillik ko'chasi, 15</Text>
        <Text style={{ color: colors.secondary }}>Manzil · Usta Motors avtoservisi, Chilonzor</Text>
        <Text style={{ fontWeight: '700' }}>Chevrolet Cobalt · oq · 01 A 777 BB</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {['Men ham boraman', 'Faqat mashina', 'Hozir'].map((item) => (
            <Pressable key={item} onPress={() => setWho(item)} style={{ backgroundColor: who === item ? colors.accentSoft : colors.subtle, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 8 }}>
              <Text style={{ color: colors.text, fontWeight: '600' }}>{item}</Text>
            </Pressable>
          ))}
        </View>
        <Text>Taxminiy narx {som(45000)}</Text>
      </View>
    </Screen>
  )
}

export function PeregonStatusScreen() {
  const navigation = useNav()
  const { colors } = useTheme()
  const [onRoad, setOnRoad] = useState(false)
  if (onRoad) {
    return (
      <Screen footer={
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button title="Ulashish" variant="success" onPress={() => navigation.popToTop()} />
          <Button title="SOS · Yordam" variant="danger" onPress={() => navigation.navigate('Sos')} />
        </View>
      }>
        <Title title="Mashinangiz yo'lda" text="Yetib borish 18 daqiqa · 18:42. Tezlik 58 km/soat." />
        <Card><Text>Haydovchi keldi · 15:38</Text><Text>Kalit topshirildi · 4 ta rasm olindi · 16:01</Text><Text>Yo'lda — Chilonzor tomon</Text></Card>
      </Screen>
    )
  }
  return (
    <Screen footer={<Button title="Bekor qilish" variant="ghost" onPress={() => setOnRoad(true)} />}>
      <Title title="Haydovchi 6 daqiqada keladi" text="U mashinangiz oldiga piyoda yetib keladi." />
      <Card>
        <Text style={{ fontWeight: '700' }}>Jasur Toshmatov · 4.9</Text>
        <Text style={{ color: colors.secondary }}>1 240 safar · 5 yil · Tasdiqlangan</Text>
      </Card>
      <Text style={{ fontSize: 32, fontWeight: '800', letterSpacing: 6 }}>4821</Text>
      <Text style={{ color: colors.secondary }}>Kalitni topshirish kodi. Kodni faqat haydovchi kelganda ayting. 4 tomondan rasm: old, o'ng, chap, orqa.</Text>
    </Screen>
  )
}

const RIDES = [
  { name: 'Akmal R.', car: 'Cobalt · 01 A 777 BB', time: '15:00 → 18:30', price: 35000, seats: '3 bo\'sh', meta: '4.9 · konditsioner' },
  { name: 'Sardor B.', car: 'Gentra', time: '15:30 → 19:10', price: 40000, seats: '2 bo\'sh', meta: '4.7' },
  { name: 'Murod K.', car: 'Nexia', time: '14:30 → 17:45', price: 60000, seats: '1 bo\'sh', meta: '4.6' },
]

export function IntercityScreen() {
  const navigation = useNav()
  const { colors } = useTheme()
  const [step, setStep] = useState<'list' | 'offer' | 'wait' | 'counter' | 'booked'>('list')
  const [price, setPrice] = useState(30000)
  if (step === 'offer') {
    return (
      <Screen footer={<Button title={`So'rov yuborish · ${som(price)}`} onPress={() => setStep('wait')} />}>
        <Header title="Reys tafsiloti" onBack={() => setStep('list')} />
        <Card><Text style={{ fontWeight: '700' }}>Akmal Rahimov · 4.9 · Cobalt</Text><Text>15:00 Yangiyer avtovokzal → 18:30 Toshkent, Olmazor</Text><Text>Haydovchi narxi {som(35000)}</Text></Card>
        <Text style={{ fontWeight: '700' }}>Sizning taklifingiz</Text>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <Button title="−" variant="secondary" onPress={() => setPrice((n) => n - 2000)} />
          <Text style={{ fontSize: 22, fontWeight: '800' }}>{som(price)}</Text>
          <Button title="+" variant="secondary" onPress={() => setPrice((n) => n + 2000)} />
        </View>
        <Text style={{ color: colors.secondary }}>Tavsiya 30–35 ming. Juda past narxni haydovchi rad etishi mumkin. 1 o'rin.</Text>
      </Screen>
    )
  }
  if (step === 'wait') {
    return (
      <Screen footer={<Button title="So'rovni bekor qilish" variant="ghost" onPress={() => setStep('counter')} />}>
        <Title title="So'rov yuborildi" text="4:52 · Akmal javobini kutyapmiz. Odatda 2 daqiqada javob beriladi." />
        <Card><Text>Taklif {som(price)} · 15:00 Yangiyer → Toshkent · 1 o'rin</Text></Card>
        <Text style={{ color: colors.warning }}>Birinchi qabul qilgan haydovchi bilan bron tasdiqlanadi.</Text>
      </Screen>
    )
  }
  if (step === 'counter') {
    return (
      <Screen footer={
        <View style={{ gap: 8 }}>
          <Button title="Qabul qilish · 32 000 so'm" onPress={() => setStep('booked')} />
          <Button title="Rad etish" variant="ghost" onPress={() => setStep('list')} />
        </View>
      }>
        <Title title="Akmal qarshi taklif yubordi" text="Siz 30 000 · haydovchi 32 000. Farq +2 000. 1:58 qoldi." />
      </Screen>
    )
  }
  if (step === 'booked') {
    return (
      <Screen footer={<Button title="Uchrashuv joyini xaritada ko'rish" onPress={() => navigation.popToTop()} />}>
        <Title title="O'rin band qilindi" text="Akmal taklifingizga rozi bo'ldi." />
        <Card>
          <Text>Bugun, 15:00 · Avtovokzal, 2-darvoza</Text>
          <Text>Akmal R. · 4.9 · Cobalt oq · 01 A 777 BB</Text>
          <Text>1 ta old o'rindiq · naqd {som(30000)}</Text>
          <Text style={{ color: colors.secondary }}>14:00 gacha bepul bekor qilish mumkin</Text>
        </Card>
      </Screen>
    )
  }
  return (
    <Screen scroll>
      <Header title="Shaharlararo" onBack={() => navigation.goBack()} />
      <Card><Text>Yangiyer, avtovokzal → Toshkent, Olmazor</Text><Text style={{ color: colors.secondary }}>Bugun, 22-okt · 15:00 · 1 o'rin · 12 ta reys</Text></Card>
      {RIDES.map((ride) => (
        <Card key={ride.name} onPress={() => setStep('offer')}>
          <Text style={{ fontWeight: '700' }}>{ride.time} · {som(ride.price)}</Text>
          <Text style={{ color: colors.secondary }}>{ride.name} · {ride.car} · {ride.seats} · {ride.meta}</Text>
        </Card>
      ))}
    </Screen>
  )
}

export function IntercityOffersScreen() {
  const navigation = useNav()
  return (
    <Screen footer={<Button title="Reyslarga" onPress={() => navigation.navigate('Intercity')} />}>
      <Title title="Takliflar" text="Reys tanlang. Narxni shu yerdan yuborasiz." />
    </Screen>
  )
}

const SERVICES = [
  { title: 'Moy almashtirish', meta: '40 daqiqa · moy + filtr', price: 180000 },
  { title: 'Kompyuter diagnostika', meta: '30 daqiqa', price: 80000 },
  { title: 'Tormoz kolodkasi', meta: '1 soat · ish + ehtiyot qism', price: 250000 },
  { title: 'Konditsioner zapravkasi', meta: '40 daqiqa', price: 150000 },
]

export function PartnerServicesScreen() {
  const navigation = useNav()
  const { colors } = useTheme()
  const [step, setStep] = useState<'list' | 'shop' | 'time' | 'done'>('list')
  const [bring, setBring] = useState(true)
  if (step === 'shop') {
    return (
      <Screen scroll footer={<Button title="Vaqt tanlash · 180 000 so'm" onPress={() => setStep('time')} />}>
        <Header title="Usta Motors" onBack={() => setStep('list')} />
        <Text style={{ color: colors.secondary }}>4.9 · 120 sharh · Chilonzor 9-kv · 1.2 km · 09:00–20:00</Text>
        {SERVICES.map((item) => (
          <Card key={item.title}><Text style={{ fontWeight: '700' }}>{item.title}</Text><Text style={{ color: colors.secondary }}>{item.meta} · {som(item.price)}</Text></Card>
        ))}
      </Screen>
    )
  }
  if (step === 'time') {
    const total = 180000 + (bring ? 45000 : 0)
    return (
      <Screen footer={<Button title={`Band qilish · ${som(total)}`} onPress={() => setStep('done')} />}>
        <Header title="Vaqt tanlash" onBack={() => setStep('shop')} />
        <Text>Usta Motors · Moy almashtirish</Text>
        <Text style={{ fontWeight: '700' }}>Pa 22 · 11:30</Text>
        <Card onPress={() => setBring(false)}><Text style={{ fontWeight: bring ? '400' : '700' }}>O'zim olib boraman · bepul</Text></Card>
        <Card onPress={() => setBring(true)}><Text style={{ fontWeight: bring ? '700' : '400' }}>Haydovchi olib borsin · +45 000</Text><Text style={{ color: colors.secondary }}>Olib boradi va qaytarib keladi</Text></Card>
        <Text style={{ fontSize: 22, fontWeight: '800' }}>Jami {som(total)}</Text>
      </Screen>
    )
  }
  if (step === 'done') {
    return (
      <Screen footer={<Button title="Buyurtmalarimga o'tish" onPress={() => navigation.navigate('Tabs', { screen: 'Tarix' })} />}>
        <Title title="Bron tasdiqlandi" text="Usta Motors sizni kutadi. Kod YL-4821." />
        <Card>
          <Text>Moy almashtirish · Bugun, 11:30</Text>
          <Text>Chilonzor 9-kvartal</Text>
          <Text>Haydovchi 11:00 da keladi</Text>
          <Text style={{ fontWeight: '800' }}>Jami {som(225000)}</Text>
          <Text style={{ color: colors.secondary }}>Bron → Tasdiq → Jarayonda → Tayyor</Text>
        </Card>
      </Screen>
    )
  }
  const partners = [
    { title: 'Usta Motors', text: 'Avtoservis · 4.9 · 1.2 km · bugun bo\'sh vaqt bor' },
    { title: 'Aqua Moyka', text: 'Moyka · 4.7 · 800 m · 40 000 dan' },
    { title: 'Tez Evakuator', text: 'Evakuator · 4.9 · 2.4 km · 15 daqiqada yetib keladi' },
  ]
  return (
    <Screen scroll>
      <Header title="Hamkorlar xizmatlari" onBack={() => navigation.goBack()} />
      <Text style={{ color: colors.secondary }}>Ishonchli ustalar · Yello orqali bron</Text>
      <Card><Text style={{ fontWeight: '700' }}>Birinchi bronga −20%</Text><Text>Promokod YELLO20 · 31-oktabrgacha</Text></Card>
      {partners.map((item) => (
        <Card key={item.title} onPress={() => setStep('shop')}>
          <Text style={{ fontWeight: '700' }}>{item.title}</Text>
          <Text style={{ color: colors.secondary }}>{item.text}</Text>
        </Card>
      ))}
    </Screen>
  )
}
