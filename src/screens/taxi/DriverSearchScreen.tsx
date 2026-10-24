import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import WebView from 'react-native-webview'

const MOCK_DRIVER = {
  name: 'Sherzod',
  rating: '4.9',
  car: 'Chevrolet Gentra',
  plate: '01 A 777 BA',
  eta: 2,
  photo: '👨‍💼',
}

function buildMapHtml(driverLat: number, driverLng: number, userLat: number, userLng: number) {
  return `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>html,body,#map{margin:0;padding:0;width:100%;height:100%;}</style>
</head><body><div id="map"></div>
<script>
var map = L.map('map',{zoomControl:false,attributionControl:false});
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
var carIcon = L.divIcon({className:'',html:'<div style="font-size:32px;">🚗</div>',iconAnchor:[16,16]});
var userIcon = L.divIcon({className:'',html:'<div style="width:14px;height:14px;border-radius:50%;background:#1D4ED8;border:3px solid #fff;box-shadow:0 0 0 3px rgba(29,78,216,0.3);"></div>',iconAnchor:[7,7]});
var car = L.marker([${driverLat},${driverLng}],{icon:carIcon}).addTo(map);
L.marker([${userLat},${userLng}],{icon:userIcon}).addTo(map);
var bounds = L.latLngBounds([[${driverLat},${driverLng}],[${userLat},${userLng}]]);
map.fitBounds(bounds,{padding:[60,60]});

// Animate car toward user
var steps = 60;
var dlat = (${userLat}-${driverLat})/steps;
var dlng = (${userLng}-${driverLng})/steps;
var step = 0;
var iv = setInterval(function(){
  step++;
  car.setLatLng([${driverLat}+dlat*step, ${driverLng}+dlng*step]);
  if(step>=steps) clearInterval(iv);
},2000);
</script></body></html>`
}

export default function DriverSearchScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets()
  const { destination, tariff, pickup } = route.params || {}
  const [eta, setEta] = useState(MOCK_DRIVER.eta)
  const [phase, setPhase] = useState<'searching' | 'found' | 'arriving'>('searching')

  // Toshkent coords
  const userLat = 41.2995, userLng = 69.2401
  const driverLat = userLat + 0.008, driverLng = userLng - 0.006

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('found'), 2500)
    const t2 = setTimeout(() => setPhase('arriving'), 4000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    if (phase !== 'arriving') return
    const iv = setInterval(() => {
      setEta(e => {
        if (e <= 1) {
          clearInterval(iv)
          navigation.replace('Trip', { destination, tariff, pickup, driver: MOCK_DRIVER })
          return 0
        }
        return e - 1
      })
    }, 10000)
    return () => clearInterval(iv)
  }, [phase])

  return (
    <View style={styles.container}>
      <WebView
        style={styles.map}
        originWhitelist={['*']}
        source={{ html: buildMapHtml(driverLat, driverLng, userLat, userLng) }}
        javaScriptEnabled
        mixedContentMode="always"
      />

      {/* Top back */}
      <TouchableOpacity
        style={[styles.backBtn, { top: (insets.top || 0) + 12 }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      {/* Bottom panel */}
      <View style={[styles.bottomSheet, { paddingBottom: (insets.bottom || 0) + 20 }]}>
        {phase === 'searching' ? (
          <View style={styles.searchingRow}>
            <ActivityIndicator color="#1D4ED8" size="small" />
            <Text style={styles.searchingText}>Haydovchi qidirilmoqda...</Text>
          </View>
        ) : (
          <>
            {/* ETA bar */}
            <View style={styles.etaBar}>
              <Text style={styles.etaLabel}>Haydovchi yetib kelmoqda</Text>
              <View style={styles.etaBadge}>
                <Text style={styles.etaText}>{eta} daq</Text>
              </View>
            </View>

            {/* Driver info */}
            <View style={styles.driverRow}>
              <View style={styles.driverPhoto}>
                <Text style={styles.driverPhotoText}>{MOCK_DRIVER.photo}</Text>
              </View>
              <View style={styles.driverInfo}>
                <View style={styles.driverNameRow}>
                  <Text style={styles.driverName}>{MOCK_DRIVER.name}</Text>
                  <Text style={styles.driverRating}>⭐ {MOCK_DRIVER.rating}</Text>
                </View>
                <Text style={styles.driverCar}>{MOCK_DRIVER.car} ({MOCK_DRIVER.plate})</Text>
              </View>
            </View>

            {/* Action buttons */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionIcon}>💬</Text>
                <Text style={styles.actionText}>Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.callBtn]}>
                <Text style={styles.actionIcon}>📞</Text>
                <Text style={[styles.actionText, styles.callText]}>Qo'ng'iroq</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelText}>Bekor qilish</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { flex: 1 },
  backBtn: {
    position: 'absolute', left: 16,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 4, elevation: 4,
  },
  backIcon: { fontSize: 20, color: '#111827' },
  bottomSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 20, paddingHorizontal: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 12,
  },
  searchingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 20, justifyContent: 'center' },
  searchingText: { fontSize: 16, color: '#374151', fontWeight: '600' },
  etaBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  etaLabel: { fontSize: 16, fontWeight: '700', color: '#111827' },
  etaBadge: { backgroundColor: '#EFF6FF', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  etaText: { fontSize: 14, fontWeight: '700', color: '#1D4ED8' },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  driverPhoto: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
  },
  driverPhotoText: { fontSize: 28 },
  driverInfo: { flex: 1 },
  driverNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  driverName: { fontSize: 17, fontWeight: '700', color: '#111827' },
  driverRating: { fontSize: 14, color: '#374151' },
  driverCar: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  actionsRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderRadius: 12, paddingVertical: 13,
    backgroundColor: '#F3F4F6',
  },
  callBtn: { backgroundColor: '#EFF6FF' },
  actionIcon: { fontSize: 18 },
  actionText: { fontSize: 15, fontWeight: '600', color: '#374151' },
  callText: { color: '#1D4ED8' },
  cancelBtn: { alignItems: 'center', paddingVertical: 12 },
  cancelText: { fontSize: 15, color: '#6B7280' },
})
