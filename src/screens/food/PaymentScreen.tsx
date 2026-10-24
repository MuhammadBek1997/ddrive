import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const METHODS = [
  { id: 'cash', label: 'Naqd pul', desc: 'Kuryer orqali to\'lash', icon: '💵' },
  { id: 'card', label: 'Plastik karta', desc: 'Uzcard, Humo, Visa', icon: '💳' },
  { id: 'wallet', label: 'Elektron hamyon', desc: 'Yello Pay, Click, Payme', icon: '📱' },
]

export default function PaymentScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets()
  const { total = 33000 } = route.params || {}
  const [selected, setSelected] = useState('card')

  return (
    <View style={[styles.container, { paddingTop: insets.top || 0 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
        <Text style={styles.title}>To'lov turi</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {METHODS.map(m => (
          <TouchableOpacity
            key={m.id}
            style={[styles.methodRow, selected === m.id && styles.methodSelected]}
            onPress={() => setSelected(m.id)}
          >
            <View style={styles.methodIcon}><Text style={styles.methodIconText}>{m.icon}</Text></View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodLabel}>{m.label}</Text>
              <Text style={styles.methodDesc}>{m.desc}</Text>
            </View>
            <View style={[styles.radio, selected === m.id && styles.radioSelected]}>
              {selected === m.id && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        ))}

        {/* Card form */}
        {selected === 'card' && (
          <View style={styles.cardForm}>
            <Text style={styles.formTitle}>Yangi karta qo'shish</Text>
            <Text style={styles.inputLabel}>Karta raqami</Text>
            <TextInput
              style={styles.input}
              placeholder="8600 12** **** 5678"
              keyboardType="number-pad"
              placeholderTextColor="#9CA3AF"
            />
            <View style={styles.formRow}>
              <View style={styles.formHalf}>
                <Text style={styles.inputLabel}>Muddati</Text>
                <TextInput style={styles.input} placeholder="12/28" placeholderTextColor="#9CA3AF" keyboardType="number-pad" />
              </View>
              <View style={styles.formHalf}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput style={styles.input} placeholder="***" placeholderTextColor="#9CA3AF" keyboardType="number-pad" secureTextEntry />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: (insets.bottom || 0) + 16 }]}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Jami to'lov:</Text>
          <Text style={styles.totalAmount}>{total.toLocaleString()} UZS</Text>
        </View>
        <TouchableOpacity
          style={styles.payBtn}
          onPress={() => navigation.navigate('OrderTracking', { total })}
        >
          <Text style={styles.payText}>To'lash</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  backIcon: { fontSize: 22, color: '#111827' },
  title: { fontSize: 18, fontWeight: '700', color: '#111827' },
  content: { padding: 16, gap: 10, paddingBottom: 140 },
  methodRow: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  methodSelected: { borderColor: '#1D4ED8', backgroundColor: '#EFF6FF' },
  methodIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  methodIconText: { fontSize: 22 },
  methodInfo: { flex: 1 },
  methodLabel: { fontSize: 15, fontWeight: '700', color: '#111827' },
  methodDesc: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: '#D1D5DB',
    alignItems: 'center', justifyContent: 'center',
  },
  radioSelected: { borderColor: '#1D4ED8' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#1D4ED8' },
  cardForm: { backgroundColor: '#fff', borderRadius: 14, padding: 16, gap: 10 },
  formTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 4 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 15, color: '#111827', backgroundColor: '#F9FAFB',
  },
  formRow: { flexDirection: 'row', gap: 12 },
  formHalf: { flex: 1 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: '#F3F4F6', gap: 12,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 14, color: '#6B7280' },
  totalAmount: { fontSize: 18, fontWeight: '800', color: '#111827' },
  payBtn: { backgroundColor: '#F97316', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  payText: { fontSize: 16, fontWeight: '700', color: '#fff' },
})
