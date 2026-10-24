import { ReactNode, useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from './theme'

export function Screen({
  children,
  scroll,
  footer,
  pad = true,
  map,
}: {
  children: ReactNode
  scroll?: boolean
  footer?: ReactNode
  pad?: boolean
  map?: boolean
}) {
  const insets = useSafeAreaInsets()
  const { colors } = useTheme()
  const body = scroll ? (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: pad ? 16 : 0, paddingBottom: 28 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={{ flex: 1, padding: pad ? 16 : 0 }}>{children}</View>
  )

  return (
    <View style={{ flex: 1, backgroundColor: map ? colors.map : colors.canvas, paddingTop: insets.top }}>
      {body}
      {footer ? (
        <View style={{ padding: 16, paddingBottom: Math.max(insets.bottom, 12), backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border }}>
          {footer}
        </View>
      ) : null}
    </View>
  )
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
}: {
  title: string
  onPress?: () => void
  variant?: 'primary' | 'secondary' | 'dark' | 'outline' | 'ghost' | 'danger' | 'success'
  disabled?: boolean
}) {
  const { colors } = useTheme()
  const filled = variant === 'primary' || variant === 'dark' || variant === 'danger' || variant === 'success'
  const bg =
    variant === 'primary' ? colors.accent
    : variant === 'dark' ? '#172554'
    : variant === 'danger' ? colors.error
    : variant === 'success' ? colors.success
    : variant === 'secondary' ? colors.subtle
    : 'transparent'
  const fg = filled ? '#FFFFFF' : colors.text
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [{
        minHeight: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        backgroundColor: bg,
        borderWidth: variant === 'outline' ? 1 : 0,
        borderColor: colors.border,
        opacity: disabled ? 0.45 : pressed ? 0.88 : 1,
      }]}
    >
      <Text style={{ color: fg, fontSize: 16, fontWeight: '600' }}>{title}</Text>
    </Pressable>
  )
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secure,
  error,
  hint,
  keyboard,
  multiline,
}: {
  label: string
  value: string
  onChangeText: (v: string) => void
  placeholder?: string
  secure?: boolean
  error?: string
  hint?: string
  keyboard?: 'default' | 'phone-pad' | 'number-pad'
  multiline?: boolean
}) {
  const { colors } = useTheme()
  const [focus, setFocus] = useState(false)
  const border = error ? colors.error : focus ? colors.accent : colors.border
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: colors.secondary, fontSize: 13, fontWeight: '500' }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.secondary}
        secureTextEntry={secure}
        keyboardType={keyboard}
        multiline={multiline}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          minHeight: multiline ? 96 : 52,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: border,
          backgroundColor: colors.surface,
          color: colors.text,
          paddingHorizontal: 14,
          paddingTop: multiline ? 12 : 0,
          fontSize: 16,
          textAlignVertical: multiline ? 'top' : 'center',
        }}
      />
      {error ? <Text style={{ color: colors.error, fontSize: 12 }}>{error}</Text> : null}
      {!error && hint ? <Text style={{ color: colors.secondary, fontSize: 12 }}>{hint}</Text> : null}
    </View>
  )
}

export function Header({ title, onBack, right }: { title: string; onBack?: () => void; right?: ReactNode }) {
  const { colors } = useTheme()
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 48, gap: 8 }}>
      {onBack ? (
        <Pressable onPress={onBack} hitSlop={8} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ color: colors.text, fontSize: 22, lineHeight: 24 }}>‹</Text>
        </Pressable>
      ) : null}
      <Text style={{ flex: 1, color: colors.text, fontSize: 20, fontWeight: '700' }}>{title}</Text>
      {right}
    </View>
  )
}

export function CityMap({ children, style }: { children?: ReactNode; style?: ViewStyle }) {
  const { colors } = useTheme()
  return (
    <View style={[{ flex: 1, backgroundColor: colors.map, overflow: 'hidden' }, style]}>
      <View style={[styles.roadH, { backgroundColor: colors.surface, top: '28%' }]} />
      <View style={[styles.roadH, { backgroundColor: colors.surface, top: '62%' }]} />
      <View style={[styles.roadV, { backgroundColor: colors.surface, left: '30%' }]} />
      <View style={[styles.roadV, { backgroundColor: colors.surface, left: '68%' }]} />
      <View style={[styles.route, { backgroundColor: colors.accent }]} />
      <MapLabel top="22%" left={16} text="Amir Temur ko'chasi" />
      <MapLabel top="40%" left="34%" text="Navoiy ko'chasi" />
      <MapLabel top="56%" left={16} text="Bobur ko'chasi" />
      <MapLabel top="70%" left="40%" text="Chorsu bozori" />
      <MapLabel top="16%" left="62%" text="Toshkent City" />
      {children}
    </View>
  )
}

function MapLabel({ top, left, text }: { top: `${number}%` | number; left: `${number}%` | number; text: string }) {
  const { colors } = useTheme()
  return (
    <Text style={{ position: 'absolute', top, left, color: colors.mapInk, fontSize: 11, fontWeight: '600' }}>{text}</Text>
  )
}

export function RoundButton({ label, onPress }: { label: string; onPress?: () => void }) {
  const { colors } = useTheme()
  return (
    <Pressable onPress={onPress} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}>
      <Text style={{ color: colors.text, fontWeight: '700' }}>{label}</Text>
    </Pressable>
  )
}

export function Card({ children, onPress, style }: { children: ReactNode; onPress?: () => void; style?: ViewStyle }) {
  const { colors } = useTheme()
  const box = {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    ...style,
  }
  if (!onPress) return <View style={box}>{children}</View>
  return <Pressable onPress={onPress} style={({ pressed }) => [box, { opacity: pressed ? 0.9 : 1 }]}>{children}</Pressable>
}

export function Muted({ children }: { children: string }) {
  const { colors } = useTheme()
  return <Text style={{ color: colors.secondary, fontSize: 13 }}>{children}</Text>
}

export function Title({ children }: { children: string }) {
  const { colors } = useTheme()
  return <Text style={{ color: colors.text, fontSize: 17, fontWeight: '600' }}>{children}</Text>
}

const styles = StyleSheet.create({
  roadH: { position: 'absolute', left: 0, right: 0, height: 10, opacity: 0.9 },
  roadV: { position: 'absolute', top: 0, bottom: 0, width: 10 },
  route: { position: 'absolute', width: 4, height: '46%', left: '48%', top: '24%', borderRadius: 4, transform: [{ rotate: '28deg' }] },
})
