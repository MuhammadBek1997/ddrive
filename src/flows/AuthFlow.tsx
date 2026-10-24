import { useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useAuthStore } from '../store/authStore'
import { Button, Field, Header, Screen } from '../ui/components'
import { useTheme } from '../ui/theme'

type Account = { firstName: string; lastName: string; phone: string; password: string }

function useNav() {
  return useNavigation<any>()
}

export function WelcomeScreen() {
  const navigation = useNav()
  const { colors } = useTheme()
  return (
    <Screen footer={
      <View style={{ gap: 10 }}>
        <Button title="Kirish" onPress={() => navigation.navigate('Login')} />
        <Button title="Ro'yxatdan o'tish" variant="dark" onPress={() => navigation.navigate('RegisterName')} />
        <Button title="Hamkorimiz bo'ling" variant="ghost" onPress={() => navigation.navigate('BecomePartner')} />
      </View>
    }>
      <View style={{ flex: 1, justifyContent: 'flex-end', gap: 16, paddingBottom: 12 }}>
        <Text style={{ color: colors.accent, fontSize: 42, fontWeight: '800' }}>yello</Text>
        <Text style={{ color: colors.text, fontSize: 32, fontWeight: '700', lineHeight: 38 }}>Shaharingiz uchun{'\n'}super ilova</Text>
        <Text style={{ color: colors.secondary, fontSize: 15, lineHeight: 22 }}>
          Taksi · Kuryer (Auto / Moto / Velo) · Og'ir yuk · Restoranlar · Dorixona · Market
        </Text>
      </View>
    </Screen>
  )
}

export function LoginScreen() {
  const navigation = useNav()
  const route = useRoute<any>()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [phone, setPhone] = useState('+998 90 123 45 67')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(route.params?.error ? 'Telefon yoki parol noto\'g\'ri' : '')

  const submit = () => {
    if (password.length < 8) {
      setError('Kamida 8 ta belgi')
      return
    }
    setAuth('demo', { id: 'u1', name: 'Aziz Aliyev', phone })
  }

  return (
    <Screen scroll footer={<Button title="Kirish" onPress={submit} />}>
      <Header title="Kirish" onBack={() => navigation.goBack()} />
      <View style={{ gap: 16, marginTop: 12 }}>
        <Text style={{ fontSize: 24, fontWeight: '700' }}>Xush kelibsiz</Text>
        <Text style={{ color: '#64748B' }}>Telefon raqamingiz va parolingiz bilan kiring</Text>
        <Field label="Telefon raqami" value={phone} onChangeText={setPhone} keyboard="phone-pad" hint="Tasdiqlangan raqam" />
        <Field label="Parol" value={password} onChangeText={(v) => { setPassword(v); setError('') }} secure error={error} hint="Kamida 8 ta belgi" />
        <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={{ color: '#2563EB', fontWeight: '600' }}>Parolni unutdingizmi?</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('RegisterName')}>
          <Text>Hisobingiz yo'qmi? <Text style={{ color: '#2563EB', fontWeight: '600' }}>Ro'yxatdan o'ting</Text></Text>
        </Pressable>
      </View>
    </Screen>
  )
}

export function RegisterNameScreen() {
  const navigation = useNav()
  const [firstName, setFirstName] = useState('Aziz')
  const [lastName, setLastName] = useState('Aliyev')
  return (
    <Screen scroll footer={
      <Button
        title="Davom etish"
        disabled={!firstName.trim() || !lastName.trim()}
        onPress={() => navigation.navigate('RegisterAccount', { firstName, lastName })}
      />
    }>
      <Header title="Ro'yxat" onBack={() => navigation.goBack()} />
      <Text style={{ marginTop: 8, color: '#64748B' }}>1-qadam, 4 tadan</Text>
      <Text style={{ fontSize: 24, fontWeight: '700', marginTop: 8 }}>Ismingiz nima?</Text>
      <Text style={{ color: '#64748B', marginTop: 6, marginBottom: 16 }}>Haydovchi va kuryerlar sizga shu ism bilan murojaat qiladi</Text>
      <View style={{ gap: 12 }}>
        <Field label="Ism" value={firstName} onChangeText={setFirstName} />
        <Field label="Familiya" value={lastName} onChangeText={setLastName} />
      </View>
    </Screen>
  )
}

export function RegisterAccountScreen() {
  const navigation = useNav()
  const route = useRoute<any>()
  const [phone, setPhone] = useState('+998 ')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const next = () => {
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 12) {
      setError('Raqamni to\'liq kiriting')
      return
    }
    if (password.length < 8) {
      setError('Kamida 8 ta belgi')
      return
    }
    navigation.navigate('RegisterCode', { ...route.params, phone, password })
  }
  return (
    <Screen scroll footer={<Button title="Davom etish" onPress={next} />}>
      <Header title="Ro'yxat" onBack={() => navigation.goBack()} />
      <Text style={{ marginTop: 8, color: '#64748B' }}>2-qadam, 4 tadan</Text>
      <Text style={{ fontSize: 24, fontWeight: '700', marginTop: 8 }}>Telefon va parol</Text>
      <Text style={{ color: '#64748B', marginTop: 6, marginBottom: 16 }}>Kirish shu raqam va parol bilan bo'ladi</Text>
      <View style={{ gap: 12 }}>
        <Field label="Telefon raqami" value={phone} onChangeText={setPhone} keyboard="phone-pad" placeholder="+998 90 123 45 67" />
        <Field label="Parol" value={password} onChangeText={setPassword} secure error={error} hint="Kamida 8 ta belgi" />
      </View>
    </Screen>
  )
}

export function RegisterCodeScreen() {
  const navigation = useNav()
  const route = useRoute<any>()
  const [code, setCode] = useState('')
  const [left, setLeft] = useState(60)
  useEffect(() => {
    const id = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <Screen scroll footer={
      <Button title="Tasdiqlash" disabled={code.length < 4} onPress={() => navigation.navigate('RegisterTerms', route.params)} />
    }>
      <Header title="SMS kod" onBack={() => navigation.goBack()} />
      <Text style={{ marginTop: 8, color: '#64748B' }}>3-qadam, 4 tadan</Text>
      <Text style={{ fontSize: 24, fontWeight: '700', marginTop: 8 }}>Kodni kiriting</Text>
      <Text style={{ color: '#64748B', marginTop: 6, marginBottom: 16 }}>{route.params?.phone || 'Raqamingiz'} ga yuborildi</Text>
      <Field label="SMS kod" value={code} onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))} keyboard="number-pad" hint={left > 0 ? `Qayta yuborish ${left} s` : 'Qayta yuborish mumkin'} />
    </Screen>
  )
}

export function RegisterTermsScreen() {
  const navigation = useNav()
  const route = useRoute<any>()
  const [ok, setOk] = useState(false)
  const { colors } = useTheme()
  return (
    <Screen scroll footer={<Button title="Roziman" disabled={!ok} onPress={() => navigation.navigate('RegisterSuccess', route.params)} />}>
      <Header title="Shartlar" onBack={() => navigation.goBack()} />
      <Text style={{ marginTop: 8, color: colors.secondary }}>4-qadam, 4 tadan</Text>
      <Text style={{ fontSize: 24, fontWeight: '700', marginTop: 8, color: colors.text }}>Foydalanish shartlari</Text>
      <Text style={{ color: colors.secondary, marginTop: 10, lineHeight: 22 }}>
        Buyurtma, to'lov va yetkazish shartlari bilan tanishing. Joylashuv faqat safar va yetkazish paytida ishlatiladi.
      </Text>
      <Pressable onPress={() => setOk((v) => !v)} style={{ flexDirection: 'row', gap: 10, marginTop: 20, alignItems: 'center' }}>
        <View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: 1, borderColor: colors.accent, backgroundColor: ok ? colors.accent : 'transparent' }} />
        <Text style={{ color: colors.text, flex: 1 }}>Shartlarni o'qidim va roziman</Text>
      </Pressable>
    </Screen>
  )
}

export function RegisterSuccessScreen() {
  const navigation = useNav()
  const route = useRoute<any>()
  const setAuth = useAuthStore((s) => s.setAuth)
  const account = route.params as Account
  const enter = () => setAuth('demo', { id: 'u1', name: `${account?.firstName || 'Aziz'} ${account?.lastName || 'Aliyev'}`, phone: account?.phone || '+998' })
  const { colors } = useTheme()
  return (
    <Screen footer={
      <View style={{ gap: 10 }}>
        <Button title="Boshlash" onPress={enter} />
        <Button title="Hamkor bo'lish" variant="outline" onPress={() => navigation.navigate('BecomePartner', { thenEnter: true, ...account })} />
      </View>
    }>
      <View style={{ flex: 1, justifyContent: 'center', gap: 8 }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: colors.text }}>Hisob tayyor</Text>
        <Text style={{ color: colors.secondary, fontSize: 16 }}>{account?.firstName || 'Aziz'}, xush kelibsiz.</Text>
      </View>
    </Screen>
  )
}

export function ForgotPasswordScreen() {
  const navigation = useNav()
  const [phone, setPhone] = useState('+998 ')
  const { colors } = useTheme()
  return (
    <Screen scroll footer={<Button title="Kod yuborish" onPress={() => navigation.navigate('Login', { error: false })} />}>
      <Header title="Parolni tiklash" onBack={() => navigation.goBack()} />
      <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text, marginTop: 12 }}>Parolni unutdingizmi?</Text>
      <Text style={{ color: colors.secondary, marginVertical: 8 }}>Raqamingizni kiriting — tiklash uchun SMS-kod yuboramiz</Text>
      <Field label="Telefon raqami" value={phone} onChangeText={setPhone} keyboard="phone-pad" hint="Ro'yxatdan o'tgan raqamni kiriting" />
      <Text style={{ color: colors.secondary, marginTop: 16 }}>Raqamga kirish yo'qmi? Qo'llab-quvvatlash xizmati yordam beradi.</Text>
    </Screen>
  )
}

export function BecomePartnerScreen() {
  const navigation = useNav()
  const route = useRoute<any>()
  const setAuth = useAuthStore((s) => s.setAuth)
  const { colors } = useTheme()
  const asClient = () => {
    if (route.params?.thenEnter) {
      setAuth('demo', { id: 'u1', name: `${route.params.firstName || 'Aziz'} ${route.params.lastName || 'Aliyev'}`, phone: route.params.phone || '+998' })
      return
    }
    navigation.navigate('Login')
  }
  return (
    <Screen scroll footer={<Button title="Mijoz sifatida davom etish" variant="outline" onPress={asClient} />}>
      <Header title="Hamkorlik dasturi" onBack={() => navigation.goBack()} />
      <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text, marginTop: 8 }}>Hamkorimiz bo'ling</Text>
      <Text style={{ color: colors.secondary, marginTop: 6, marginBottom: 16 }}>
        O'zingizga qulay jadvalda ishlang va har bir safar yoki yetkazishdan daromad oling. Ariza haydovchi ilovasida to'ldiriladi.
      </Text>
      <View style={{ gap: 12 }}>
        <PartnerCard title="Haydovchi" text="Yo'lovchilarni manzilga yetkazing" points={['Moslashuvchan ish vaqti', 'Har safardan daromad']} />
        <PartnerCard title="Kuryer" text="Taom, posilka, market va yuk yetkazing" points={['Auto · Moto · Velo', 'Transportni o\'zingiz tanlaysiz']} />
      </View>
    </Screen>
  )
}

function PartnerCard({ title, text, points }: { title: string; text: string; points: string[] }) {
  const { colors } = useTheme()
  return (
    <View style={{ backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 6 }}>
      <Text style={{ color: colors.text, fontSize: 17, fontWeight: '700' }}>{title}</Text>
      <Text style={{ color: colors.secondary }}>{text}</Text>
      {points.map((point) => <Text key={point} style={{ color: colors.text }}>· {point}</Text>)}
      <Text style={{ color: colors.accent, fontWeight: '600', marginTop: 4 }}>Haydovchi ilovasida boshlanadi</Text>
    </View>
  )
}
