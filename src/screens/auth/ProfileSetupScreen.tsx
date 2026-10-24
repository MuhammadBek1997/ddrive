import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp } from '@react-navigation/native'
import api from '../../services/api'
import { useAuthStore } from '../../store/authStore'

type Props = {
  navigation: NativeStackNavigationProp<any>
  route: RouteProp<{ ProfileSetup: { phone: string; token: string } }, 'ProfileSetup'>
}

export default function ProfileSetupScreen({ navigation, route }: Props) {
  const { phone, token } = route.params
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const setAuth = useAuthStore(s => s.setAuth)

  const handleSave = async () => {
    if (!firstName.trim()) {
      setError("Ismingizni kiriting")
      return
    }
    setError('')
    setLoading(true)
    try {
      // Set token temporarily for this request
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      const res = await api.post('/auth/profile', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone,
      })
      setAuth(token, res.data.user)
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Profilingizni to'ldiring</Text>
        <Text style={styles.subtitle}>Bu ma'lumotlar haydovchilar uchun ko'rinadi</Text>

        <Text style={styles.label}>Ism *</Text>
        <TextInput
          style={styles.input}
          placeholder="Masalan: Jasur"
          value={firstName}
          onChangeText={setFirstName}
          autoFocus
          autoCapitalize="words"
        />

        <Text style={styles.label}>Familiya</Text>
        <TextInput
          style={styles.input}
          placeholder="Masalan: Toshmatov"
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="words"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.btn, loading && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.btnText}>Saqlash</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { paddingHorizontal: 24, paddingTop: 80, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 32 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 18,
    color: '#111',
  },
  error: { color: '#EF4444', fontSize: 13, marginBottom: 8 },
  btn: {
    backgroundColor: '#FACC15',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: { fontSize: 16, fontWeight: '700', color: '#111' },
})
