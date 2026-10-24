import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const MOCK_MODE = true

export default function PhoneScreen({ navigation }: any) {
  const insets = useSafeAreaInsets()
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendOtp = async () => {
    const digits = phone.replace(/\D/g, '')
    if (digits.length !== 9) { setError("9 ta raqam kiriting"); return }
    setError('')
    setLoading(true)
    const fullPhone = '+998' + digits
    if (MOCK_MODE) {
      setLoading(false)
      navigation.navigate('Otp', { phone: fullPhone })
      return
    }
    try {
      const api = (await import('../../services/api')).default
      await api.post('/auth/send-otp', { phone: fullPhone })
      navigation.navigate('Otp', { phone: fullPhone })
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Xatolik yuz berdi')
    } finally { setLoading(false) }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: (insets.top || 0) + 16, paddingBottom: (insets.bottom || 0) + 32 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Ro'yxatdan o'tish</Text>
        <Text style={styles.subtitle}>Ma'lumotlaringizni kiriting va xizmatlardan foydalaning</Text>

        <View style={styles.label}><Text style={styles.labelText}>Telefon raqami</Text></View>
        <View style={[styles.inputRow, error ? styles.inputError : null]}>
          <View style={styles.prefix}>
            <Text style={styles.prefixText}>+998</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="90 123 45 67"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
            maxLength={9}
            value={phone}
            onChangeText={t => { setPhone(t.replace(/\D/g, '')); setError('') }}
            autoFocus
          />
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.btn, loading && { opacity: 0.7 }]}
          onPress={handleSendOtp}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>Davom etish</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.guestBtn}
          onPress={() => {
            const { useAuthStore } = require('../../store/authStore')
            useAuthStore.getState().setAuth('guest', { id: 'guest', name: 'Mehmon', phone: '' })
          }}
        >
          <Text style={styles.guestText}>Mehmon sifatida davom etish</Text>
        </TouchableOpacity>
        <Text style={styles.note}>* Mehmon rejimida tarix saqlanmaydi</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  container: { paddingHorizontal: 24 },
  title: { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 8, marginTop: 16 },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 32, lineHeight: 22 },
  label: { marginBottom: 8 },
  labelText: { fontSize: 14, fontWeight: '600', color: '#374151' },
  inputRow: {
    flexDirection: 'row',
    borderWidth: 1.5, borderColor: '#E5E7EB',
    borderRadius: 12, overflow: 'hidden', marginBottom: 8,
  },
  inputError: { borderColor: '#EF4444' },
  prefix: {
    backgroundColor: '#F9FAFB', paddingHorizontal: 14,
    justifyContent: 'center', borderRightWidth: 1, borderRightColor: '#E5E7EB',
  },
  prefixText: { fontSize: 16, fontWeight: '600', color: '#374151' },
  input: {
    flex: 1, fontSize: 17, paddingHorizontal: 14,
    paddingVertical: 15, color: '#111827', letterSpacing: 1,
  },
  error: { color: '#EF4444', fontSize: 13, marginBottom: 8 },
  btn: {
    backgroundColor: '#1D4ED8', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginTop: 8, marginBottom: 16,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  guestBtn: { alignItems: 'center', paddingVertical: 12 },
  guestText: { fontSize: 15, color: '#374151', fontWeight: '500' },
  note: { textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginTop: 4 },
})
