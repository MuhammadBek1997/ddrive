import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import WebView from 'react-native-webview'

const TARIFFS = [
  { id: 'ekonom', name: 'Ekonom', icon: '🚗', price: '12 000', priceNum: 12000, eta: '3 daqiqa', desc: "1-4 yo'lovchi" },
  { id: 'komfort', name: 'Komfort', icon: '🚙', price: '18 000', priceNum: 18000, eta: '2 daqiqa', desc: 'Keng salon, sovutgich' },
  { id: 'premium', name: 'Premium', icon: '🚘', price: '28 000', priceNum: 28000, eta: '5 daqiqa', desc: 'Premium, WiFi' },
]

const PICKUP = { lat: 41.2995, lng: 69.2401 }
const DEST = { lat: 41.3095, lng: 69.2501 }

function buildMapHtml() {
  return `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>html,body,#map{margin:0;padding:0;width:100%;height:100%;}</style>
</head><body><div id="map"></div>
<script>
var map = L.map('map',{zoomControl:false,attributionControl:false});
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
var fromIcon = L.divIcon({className:'',html:'<div style="width:14px;height:14px;border-radius:50%;background:#1D4ED8;border:3px solid #fff;box-shadow:0 0 0 3px rgba(29,78,216,0.3);"></div>',iconAnchor:[7,7]});
var toIcon = L.divIcon({className:'',html:'<div style="font-size:28px;line-height:1;">👑</div>',iconAnchor:[14,28]});
L.marker([${PICKUP.lat},${PICKUP.lng}],{icon:fromIcon}).addTo(map);
L.marker([${DEST.lat},${DEST.lng}],{icon:toIcon}).addTo(map);
fetch('https://router.project-osrm.org/route/v1/driving/${PICKUP.lng},${PICKUP.lat};${DEST.lng},${DEST.lat}?overview=full&geometries=geojson')
  .then(r=>r.json()).then(d=>{
    var c=d.routes[0].geometry.coordinates.map(p=>[p[1],p[0]]);
    L.polyline(c,{color:'#1D4ED8',weight:5,opacity:0.9}).addTo(map);
    map.fitBounds(L.latLngBounds(c),{padding:[50,50]});
  }).catch(()=>{
    L.polyline([[${PICKUP.lat},${PICKUP.lng}],[${DEST.lat},${DEST.lng}]],{color:'#1D4ED8',weight:4,dashArray:'8,4'}).addTo(map);
    map.fitBounds([[${PICKUP.lat},${PICKUP.lng}],[${DEST.lat},${DEST.lng}]],{padding:[50,50]});
  });
</script></body></html>`
}

export default function ConfirmTripScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets()
  const { destination } = route.params || {}
  const [selected, setSelected] = useState('komfort')
  const tariff = TARIFFS.find(t => t.id === selected)!

  return (
    <View style={styles.container}>
      {/* Map */}
      <WebView
        style={styles.map}
        originWhitelist={['*']}
        source={{ html: buildMapHtml() }}
        javaScriptEnabled
        mixedContentMode="always"
      />

      {/* Back btn */}
      <TouchableOpacity
        style={[styles.backBtn, { top: (insets.top || 0) + 12 }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      {/* Bottom panel */}
      <View style={[styles.bottomSheet, { paddingBottom: (insets.bottom || 0) + 20 }]}>
        {/* Route info */}
        <View style={styles.routeInfo}>
          <View style={styles.routeRow}>
            <View style={styles.routeDotBlue} />
            <Text style={styles.routeText} numberOfLines={1}>Mustaqillik shoh ko'chasi, 15</Text>
          </View>
          <View style={styles.routeDivider} />
          <View style={styles.routeRow}>
            <View style={styles.routeDotOrange} />
            <Text style={styles.routeText} numberOfLines={1}>
              {destination?.address || destination?.name || 'Amir Temur xiyoboni'}
            </Text>
          </View>
        </View>

        {/* Tariff cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tariffScroll}>
          {TARIFFS.map(t => (
            <TouchableOpacity
              key={t.id}
              style={[styles.tariffCard, selected === t.id && styles.tariffSelected]}
              onPress={() => setSelected(t.id)}
            >
              <Text style={styles.tariffIcon}>{t.icon}</Text>
              <Text style={[styles.tariffName, selected === t.id && styles.tariffNameSelected]}>{t.name}</Text>
              <Text style={[styles.tariffPrice, selected === t.id && styles.tariffPriceSelected]}>
                {t.price} UZS
              </Text>
              <Text style={styles.tariffEta}>{t.eta}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Order button */}
        <TouchableOpacity
          style={styles.orderBtn}
          onPress={() => navigation.navigate('DriverSearch', {
            destination,
            tariff,
            pickup: { lat: PICKUP.lat, lng: PICKUP.lng, label: "Mustaqillik shoh ko'chasi, 15" },
          })}
        >
          <Text style={styles.orderBtnText}>Buyurtma berish — {tariff.price} UZS</Text>
        </TouchableOpacity>
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
    paddingTop: 16, paddingHorizontal: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 12,
  },
  routeInfo: { marginBottom: 16, gap: 8 },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  routeDotBlue: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#1D4ED8' },
  routeDotOrange: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#F97316' },
  routeText: { fontSize: 14, color: '#374151', fontWeight: '500', flex: 1 },
  routeDivider: { width: 2, height: 12, backgroundColor: '#E5E7EB', marginLeft: 4 },
  tariffScroll: { gap: 10, paddingBottom: 4 },
  tariffCard: {
    width: 110, borderRadius: 16, padding: 14, alignItems: 'center', gap: 4,
    backgroundColor: '#F9FAFB', borderWidth: 1.5, borderColor: '#E5E7EB',
  },
  tariffSelected: { backgroundColor: '#EFF6FF', borderColor: '#1D4ED8' },
  tariffIcon: { fontSize: 28, marginBottom: 4 },
  tariffName: { fontSize: 14, fontWeight: '700', color: '#374151' },
  tariffNameSelected: { color: '#1D4ED8' },
  tariffPrice: { fontSize: 16, fontWeight: '800', color: '#111827' },
  tariffPriceSelected: { color: '#1D4ED8' },
  tariffEta: { fontSize: 11, color: '#9CA3AF' },
  orderBtn: {
    backgroundColor: '#1D4ED8', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginTop: 16,
  },
  orderBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
})
