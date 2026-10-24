import { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import WebView from 'react-native-webview'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const TASHKENT = { lat: 41.2995, lng: 69.2401 }

function buildMapPickerHtml(initLat: number, initLng: number) {
  return `<!DOCTYPE html>
<html><head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
html,body,#map{margin:0;padding:0;width:100%;height:100%;overflow:hidden;}
#pin-container{
  position:fixed;
  top:50%;left:50%;
  transform:translate(-50%,-100%);
  z-index:9999;
  pointer-events:none;
  display:flex;flex-direction:column;align-items:center;
  transition:transform 0.15s ease;
}
#pin-container.lifting{transform:translate(-50%,-115%);}
#pin-shadow{
  width:14px;height:5px;
  background:rgba(0,0,0,0.22);
  border-radius:50%;
  margin-top:1px;
  transition:all 0.15s ease;
}
#pin-container.lifting #pin-shadow{width:9px;height:3px;opacity:0.35;}
</style>
</head><body>
<div id="map"></div>
<div id="pin-container">
  <svg width="36" height="48" viewBox="0 0 36 48" xmlns="http://www.w3.org/2000/svg">
    <filter id="shadow">
      <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.35)"/>
    </filter>
    <path d="M18 0 C8.059 0 0 8.059 0 18 C0 31.5 18 48 18 48 C18 48 36 31.5 36 18 C36 8.059 27.941 0 18 0 Z"
      fill="#EF4444" filter="url(#shadow)"/>
    <circle cx="18" cy="18" r="7" fill="white"/>
  </svg>
  <div id="pin-shadow"></div>
</div>
<script>
var map = L.map('map',{zoomControl:false,attributionControl:false}).setView([${initLat},${initLng}],16);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);

var pinEl = document.getElementById('pin-container');
var timer = null;

function sendCenter(){
  var c = map.getCenter();
  fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat='+c.lat+'&lon='+c.lng,{
    headers:{'User-Agent':'ZoomerPassenger/1.0'}
  })
  .then(function(r){return r.json();})
  .then(function(d){
    var a = d.address || {};
    var road = a.road || a.pedestrian || a.neighbourhood || a.suburb || '';
    var city = a.city || a.town || a.village || a.county || '';
    var addr = road
      ? (city ? road+', '+city : road)
      : (d.display_name ? d.display_name.split(',').slice(0,2).join(',') : c.lat.toFixed(5)+', '+c.lng.toFixed(5));
    window.ReactNativeWebView.postMessage(JSON.stringify({lat:c.lat,lng:c.lng,address:addr}));
  })
  .catch(function(){
    var c2 = map.getCenter();
    window.ReactNativeWebView.postMessage(JSON.stringify({lat:c2.lat,lng:c2.lng,address:c2.lat.toFixed(5)+', '+c2.lng.toFixed(5)}));
  });
}

map.on('movestart',function(){ pinEl.classList.add('lifting'); });
map.on('moveend',function(){
  pinEl.classList.remove('lifting');
  clearTimeout(timer);
  timer = setTimeout(sendCenter, 400);
});

setTimeout(sendCenter, 1500);
</script>
</body></html>`
}

export default function MapPickerScreen() {
  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()
  const [selected, setSelected] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [loading, setLoading] = useState(true)

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data)
      setSelected(data)
      setLoading(false)
    } catch {}
  }

  const handleConfirm = () => {
    if (!selected) return
    navigation.navigate('ConfirmTrip', {
      destination: {
        name: selected.address,
        address: selected.address,
        lat: selected.lat,
        lng: selected.lng,
      },
    })
  }

  return (
    <View style={styles.container}>
      <WebView
        style={styles.map}
        originWhitelist={['*']}
        source={{ html: buildMapPickerHtml(TASHKENT.lat, TASHKENT.lng) }}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
      />

      {/* Yuqori bar */}
      <View style={[styles.topBar, { paddingTop: insets.top || 16 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.topPill}>
          <Text style={styles.topText}>Borish manzilini tanlang</Text>
        </View>
      </View>

      {/* Pastki panel */}
      <View style={[styles.bottomSheet, { paddingBottom: (insets.bottom || 0) + 16 }]}>
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#FACC15" />
            <Text style={styles.loadingText}>Manzil aniqlanmoqda...</Text>
          </View>
        ) : (
          <View style={styles.addressRow}>
            <Text style={styles.pinIcon}>📍</Text>
            <Text style={styles.addressText} numberOfLines={2}>
              {selected?.address ?? '—'}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.confirmBtn, (!selected || loading) && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          disabled={!selected || loading}
        >
          <Text style={styles.confirmText}>Shu manzilga →</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'flex-end',
    paddingHorizontal: 16, paddingBottom: 8, gap: 10,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 4, elevation: 4,
  },
  backIcon: { fontSize: 20, color: '#1F2937' },
  topPill: {
    flex: 1, backgroundColor: '#fff', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 4,
  },
  topText: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  bottomSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingTop: 16, paddingHorizontal: 16, gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1, shadowRadius: 12, elevation: 12,
  },
  loadingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8,
  },
  loadingText: { fontSize: 14, color: '#9CA3AF' },
  addressRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12,
  },
  pinIcon: { fontSize: 20 },
  addressText: { flex: 1, fontSize: 15, color: '#1F2937', fontWeight: '500' },
  confirmBtn: {
    backgroundColor: '#FACC15', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
  },
  confirmBtnDisabled: { opacity: 0.5 },
  confirmText: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
})
