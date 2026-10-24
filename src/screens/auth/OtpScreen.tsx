import { useState, useRef, useEffect } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuthStore } from '../../store/authStore'

const MOCK_MODE = true
const MOCK_OTP = '1234'

export default function OtpScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets()
  const { phone } = route.params
  const [otp, setOtp] = useState(['', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(59)
  const refs = [useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null)]
  const setAuth = useAuthStore(s => s.setAuth)

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const handleDigit = (val: string, idx: number) => {
    const d = val.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[idx] = d
    setOtp(next)
    setError('')
    if (d && idx < 3) refs[idx + 1].current?.focus()
    if (next.every(x => x) && next.join('').length === 4) {
      verifyOtp(next.join(''))
    }
  }

  const handleKey = (e: any, idx: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[idx] && idx > 0) {
      refs[idx - 1].current?.focus()
      const next = [...otp]; next[idx - 1] = ''; setOtp(next)
    }
  }

  const verifyOtp = async (code: string) => {
    setLoading(true)
    if (MOCK_MODE) {
      if (code !== MOCK_OTP) {
        setError("Noto'g'ri kod. Test uchun: 1234")
        setOtp(['', '', '', ''])
        setLoading(false)
        refs[0].current?.focus()
        return
      }
      setAuth('mock-token', { id: '1', name: 'Aziz Aliyev', phone })
      setLoading(false)
      return
    }
    try {
      const api = (await import('../../services/api')).default
      const res = await api.post('/auth/verify-otp', { phone, code })
      const { token, user, isNewUser } = res.data
      if (isNewUser) navigation.navigate('ProfileSetup', { phone, token })
      else setAuth(token, user)
    } catch (e: any) {
      setError(e?.response?.data?.message || "Noto'g'ri kod")
      setOtp(['', '', '', ''])
      refs[0].current?.focus()
    } finally { setLoading(false) }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { paddingTop: (insets.top || 0) + 16, paddingBottom: (insets.bottom || 0) + 32 }]}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>SMS kodni kiriting</Text>
        <Text style={styles.subtitle}>
          <Text style={styles.phone}>{phone}</Text>
          {'\n'}raqamiga 4 ta raqamli kod yuborildi
        </Text>
        {MOCK_MODE && <Text style={styles.mockHint}>Test rejimi: 1234</Text>}

        {/* OTP boxes */}
        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={refs[i]}
              style={[styles.otpBox, digit ? styles.otpBoxFilled : null, error ? styles.otpBoxError : null]}
              value={digit}
              onChangeText={v => handleDigit(v, i)}
              onKeyPress={e => handleKey(e, i)}
              keyboardType="number-pad"
              maxLength={1}
              autoFocus={i === 0}
              textAlign="center"
              selectTextOnFocus
            />
          ))}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color="#1D4ED8" size="small" />
            <Text style={styles.loadingText}>Tekshirilmoqda...</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={() => { if (countdown > 0) return; setCountdown(59); setOtp(['', '', '', '']); refs[0].current?.focus() }}
          disabled={countdown > 0}
          style={styles.resendBtn}
        >
          <Text style={[styles.resendText, countdown > 0 && styles.resendDisabled]}>
            {countdown > 0 ? `Qayta yuborish (${countdown}s)` : 'Qayta yuborish'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 24 },
  back: { marginBottom: 28, alignSelf: 'flex-start' },
  backIcon: { fontSize: 24, color: '#374151' },
  title: { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6B7280', lineHeight: 22, marginBottom: 8 },
  phone: { fontWeight: '700', color: '#111827' },
  mockHint: { fontSize: 12, color: '#F97316', fontWeight: '600', marginBottom: 24 },
  otpRow: { flexDirection: 'row', gap: 12, justifyContent: 'center', marginBottom: 16, marginTop: 16 },
  otpBox: {
    width: 64, height: 64, borderRadius: 14,
    borderWidth: 1.5, borderColor: '#E5E7EB',
    fontSize: 26, fontWeight: '700', color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  otpBoxFilled: { borderColor: '#1D4ED8', backgroundColor: '#EFF6FF' },
  otpBoxError: { borderColor: '#EF4444' },
  error: { color: '#EF4444', fontSize: 13, textAlign: 'center', marginBottom: 8 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginVertical: 8 },
  loadingText: { fontSize: 14, color: '#6B7280' },
  resendBtn: { alignItems: 'center', marginTop: 24 },
  resendText: { fontSize: 15, color: '#1D4ED8', fontWeight: '600' },
  resendDisabled: { color: '#9CA3AF' },
})
