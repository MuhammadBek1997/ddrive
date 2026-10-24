import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import WebView from 'react-native-webview'

const STEPS = [
  { key: 'accepted', label: 'Qabul qilindi', done: true },
  { key: 'preparing', label: 'Tayyorlanmoqda', done: true },
  { key: 'onway', label: "Yo'lda", done: true, active: true },
  { key: 'delivered', label: 'Yetkazildi', done: false },
]

const MAP_HTML = `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>html,body,#map{margin:0;padding:0;width:100%;height:100%;}</style>
</head><body><div id="map"></div>
<script>
var map = L.map('map',{zoomControl:false,attributionControl:false}).setView([41.2995,69.2401],14);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
var bikeIcon = L.divIcon({className:'',html:'<div style="font-size:28px;">🛵</div>',iconAnchor:[14,14]});
var destIcon = L.divIcon({className:'',html:'<div style="font-size:24px;">🏠</div>',iconAnchor:[12,24]});
L.marker([41.2995,69.2401],{icon:bikeIcon}).addTo(map);
L.marker([41.2945,69.2501],{icon:destIcon}).addTo(map);
L.polyline([[41.2995,69.2401],[41.2945,69.2501]],{color:'#F97316',weight:4,dashArray:'10,6'}).addTo(map);
</script></body></html>`

export default function OrderTrackingScreen({ navigation }: any) {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingTop: insets.top || 0 }]}>
      {/* Top ETA */}
      <View style={styles.topBar}>
        <View style={styles.etaBox}>
          <Text style={styles.etaLabel}>YETKAZIB BERISH VAQTI</Text>
          <Text style={styles.etaValue}>15-20 daqiqa qoldi</Text>
        </View>
        <View style={styles.restaurantBadge}>
          <Text style={styles.restaurantBadgeText}>Rayhon Milliy</Text>
        </View>
      </View>

      {/* Map */}
      <WebView
        style={styles.map}
        originWhitelist={['*']}
        source={{ html: MAP_HTML }}
        javaScriptEnabled
        mixedContentMode="always"
      />

      {/* Bottom panel */}
      <View style={[styles.bottomSheet, { paddingBottom: (insets.bottom || 0) + 20 }]}>
        {/* Courier */}
        <View style={styles.courierRow}>
          <View style={styles.courierPhoto}><Text style={styles.courierEmoji}>🧑‍🦱</Text></View>
          <View style={styles.courierInfo}>
            <Text style={styles.courierName}>Sherzodbek (Yello Express)</Text>
            <Text style={styles.courierDesc}>Velosipedda • Buyurtma yo'lda</Text>
          </View>
          <View style={styles.courierActions}>
            <TouchableOpacity style={styles.actionBtn}><Text>💬</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.callBtn]}><Text>📞</Text></TouchableOpacity>
          </View>
        </View>

        {/* Steps */}
        <View style={styles.stepsRow}>
          {STEPS.map((step, i) => (
            <View key={step.key} style={styles.stepItem}>
              <View style={[
                styles.stepDot,
                step.done && styles.stepDotDone,
                step.active && styles.stepDotActive,
              ]}>
                {step.done && !step.active && <Text style={styles.stepCheck}>✓</Text>}
                {step.active && <View style={styles.stepInner} />}
              </View>
              <Text style={[styles.stepLabel, step.done && styles.stepLabelDone]}>{step.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  etaBox: {},
  etaLabel: { fontSize: 10, color: '#9CA3AF', fontWeight: '600', letterSpacing: 1 },
  etaValue: { fontSize: 22, fontWeight: '800', color: '#111827' },
  restaurantBadge: { backgroundColor: '#FEF3C7', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  restaurantBadgeText: { fontSize: 13, fontWeight: '600', color: '#92400E' },
  map: { flex: 1 },
  bottomSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 20, paddingHorizontal: 20, gap: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 12,
  },
  courierRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  courierPhoto: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  courierEmoji: { fontSize: 26 },
  courierInfo: { flex: 1 },
  courierName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  courierDesc: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  courierActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  callBtn: { backgroundColor: '#EFF6FF' },
  stepsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  stepItem: { alignItems: 'center', gap: 6, flex: 1 },
  stepDot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center',
  },
  stepDotDone: { backgroundColor: '#10B981' },
  stepDotActive: { backgroundColor: '#1D4ED8' },
  stepCheck: { fontSize: 14, color: '#fff', fontWeight: '700' },
  stepInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' },
  stepLabel: { fontSize: 10, color: '#9CA3AF', textAlign: 'center', fontWeight: '600' },
  stepLabelDone: { color: '#111827' },
})
