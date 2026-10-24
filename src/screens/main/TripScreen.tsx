import { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native'
import WebView from 'react-native-webview'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const MOCK_DRIVER = {
  name: 'Alisher Karimov',
  car: 'Chevrolet Cobalt',
  plate: '01 A 123 BC',
  rating: 4.8,
}

const PICKUP = { lat: 41.2995, lng: 69.2401, label: "Chilonzor, 9-kvartal" }

type TripStep = 'searching' | 'driver_found' | 'arriving' | 'in_trip'

function buildTripMapHtml(
  pickupLat: number, pickupLng: number,
  destLat: number, destLng: number,
  carLat: number, carLng: number,
) {
  const midLat = (pickupLat + destLat) / 2
  const midLng = (pickupLng + destLng) / 2
  const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${pickupLng},${pickupLat};${destLng},${destLat}?overview=full&geometries=geojson`

  return `<!DOCTYPE html>
<html><head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
html,body,#map{margin:0;padding:0;width:100%;height:100%;}
.car-wrap{font-size:26px;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4));}
.pin-green{width:14px;height:14px;border-radius:50%;background:#22C55E;border:3px solid #fff;box-shadow:0 0 0 3px rgba(34,197,94,0.35);}
.pin-red{width:14px;height:14px;border-radius:50%;background:#EF4444;border:3px solid #fff;box-shadow:0 0 0 3px rgba(239,68,68,0.35);}
</style>
</head><body>
<div id="map"></div>
<script>
var map = L.map('map',{zoomControl:false,attributionControl:false}).setView([${midLat},${midLng}],14);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);

var greenIcon = L.divIcon({className:'',html:'<div class="pin-green"></div>',iconAnchor:[7,7]});
var redIcon   = L.divIcon({className:'',html:'<div class="pin-red"></div>',iconAnchor:[7,7]});
var carIcon   = L.divIcon({className:'',html:'<div class="car-wrap">🚗</div>',iconAnchor:[13,13]});

L.marker([${pickupLat},${pickupLng}],{icon:greenIcon}).addTo(map);
L.marker([${destLat},${destLng}],{icon:redIcon}).addTo(map);
var carMarker = L.marker([${carLat},${carLng}],{icon:carIcon}).addTo(map);

var routeCoords = [];

// OSRM orqali yo'l bo'ylab marshrut olish
fetch('${osrmUrl}')
  .then(function(r){return r.json();})
  .then(function(data){
    if(data.routes && data.routes[0]){
      var coords = data.routes[0].geometry.coordinates.map(function(c){return [c[1],c[0]];});
      routeCoords = coords;
      L.polyline(coords,{color:'#3B82F6',weight:5,opacity:0.85}).addTo(map);
      var bounds = L.latLngBounds(coords);
      bounds.extend([${carLat},${carLng}]);
      map.fitBounds(bounds,{padding:[60,60]});
    }
  })
  .catch(function(){
    // OSRM ishlamasa to'g'ri chiziq
    L.polyline([[${pickupLat},${pickupLng}],[${destLat},${destLng}]],
      {color:'#3B82F6',weight:4,opacity:0.7,dashArray:'8,4'}).addTo(map);
    map.fitBounds([[${pickupLat},${pickupLng}],[${destLat},${destLng}]],{padding:[60,60]});
  });

// Haydovchi pozitsiyasini yangilash
window.updateCar = function(lat,lng){
  carMarker.setLatLng([lat,lng]);
};
</script>
</body></html>`
}

export default function TripScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()
  const webViewRef = useRef<InstanceType<typeof WebView>>(null)

  const destination = route.params?.destination
  const tariff = route.params?.tariff ?? { name: 'Standart', price: "15 500 so'm" }
  const destLat = PICKUP.lat + 0.025
  const destLng = PICKUP.lng + 0.018

  const [step, setStep] = useState<TripStep>('searching')
  const [carPos, setCarPos] = useState({ lat: PICKUP.lat - 0.01, lng: PICKUP.lng - 0.008 })
  const [mapReady, setMapReady] = useState(false)
  const [completed, setCompleted] = useState(false)

  // Qadamlarni simulatsiya
  useEffect(() => {
    const t1 = setTimeout(() => setStep('driver_found'), 3000)
    const t2 = setTimeout(() => setStep('arriving'), 6000)
    const t3 = setTimeout(() => setStep('in_trip'), 14000)
    const t4 = setTimeout(() => setCompleted(true), 35000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  // Yakunlanganda navigate (useEffect orqali — render vaqtida emas)
  useEffect(() => {
    if (completed) {
      navigation.replace('TripComplete', {
        destination,
        tariff,
        price: tariff.price,
        duration: '18 daqiqa',
        driver: MOCK_DRIVER,
      })
    }
  }, [completed])

  // Mashina harakatini simulatsiya
  useEffect(() => {
    if (step === 'searching') return
    const interval = setInterval(() => {
      setCarPos(prev => {
        const targetLat = step === 'in_trip' ? destLat : PICKUP.lat
        const targetLng = step === 'in_trip' ? destLng : PICKUP.lng
        const newLat = prev.lat + (targetLat - prev.lat) * 0.12
        const newLng = prev.lng + (targetLng - prev.lng) * 0.12
        if (mapReady) {
          webViewRef.current?.injectJavaScript(
            `window.updateCar && window.updateCar(${newLat},${newLng}); true;`
          )
        }
        return { lat: newLat, lng: newLng }
      })
    }, 1200)
    return () => clearInterval(interval)
  }, [step, mapReady])

  const handleCancel = () => {
    Alert.alert('Bekor qilish', 'Buyurtmani bekor qilmoqchimisiz?', [
      { text: "Yo'q", style: 'cancel' },
      { text: 'Ha', style: 'destructive', onPress: () => navigation.goBack() },
    ])
  }

  const stepLabel: Record<TripStep, string> = {
    searching: '🔍 Haydovchi qidirilmoqda...',
    driver_found: '✅ Haydovchi topildi!',
    arriving: '🚗 Haydovchi kelmoqda...',
    in_trip: '🛣 Sayohat davomida',
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        style={styles.map}
        originWhitelist={['*']}
        source={{ html: buildTripMapHtml(PICKUP.lat, PICKUP.lng, destLat, destLng, carPos.lat, carPos.lng) }}
        onLoad={() => setMapReady(true)}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
      />

      {/* Yuqori bar */}
      <View style={[styles.topBar, { paddingTop: insets.top || 16 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={handleCancel}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.stepPill}>
          <Text style={styles.stepText}>{stepLabel[step]}</Text>
        </View>
      </View>

      {/* Pastki panel */}
      <View style={[styles.bottomSheet, { paddingBottom: (insets.bottom || 0) + 16 }]}>
        {step === 'searching' ? (
          <View style={styles.searchingBlock}>
            <Text style={styles.searchingTitle}>Haydovchi qidirilmoqda...</Text>
            <Text style={styles.searchingSub}>Yaqin atrofdagi haydovchilar tekshirilmoqda</Text>
          </View>
        ) : (
          <>
            {/* Haydovchi */}
            <View style={styles.driverRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{MOCK_DRIVER.name.charAt(0)}</Text>
              </View>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{MOCK_DRIVER.name}</Text>
                <Text style={styles.driverCar}>{MOCK_DRIVER.car} · {MOCK_DRIVER.plate}</Text>
                <Text style={styles.driverRating}>⭐ {MOCK_DRIVER.rating}</Text>
              </View>
              <TouchableOpacity style={styles.callBtn}>
                <Text style={styles.callIcon}>📞</Text>
              </TouchableOpacity>
            </View>

            {/* Yo'nalish */}
            <View style={styles.routeCard}>
              <View style={styles.routeRow}>
                <Text style={styles.dotGreen}>●</Text>
                <Text style={styles.routeAddr}>{PICKUP.label}</Text>
              </View>
              <View style={styles.routeDivider} />
              <View style={styles.routeRow}>
                <Text style={styles.dotRed}>●</Text>
                <Text style={styles.routeAddr}>
                  {destination?.name ?? destination?.address ?? 'Belgilangan manzil'}
                </Text>
              </View>
            </View>

            {/* Meta + Tarif */}
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Text style={styles.metaVal}>
                  {step === 'in_trip' ? '~15 daq' : '3 daq'}
                </Text>
                <Text style={styles.metaKey}>{step === 'in_trip' ? 'Qoldi' : 'Keladi'}</Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaItem}>
                <Text style={styles.metaVal}>4.2 km</Text>
                <Text style={styles.metaKey}>Masofa</Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaItem}>
                <Text style={styles.metaVal}>{tariff.price}</Text>
                <Text style={styles.metaKey}>{tariff.name}</Text>
              </View>
            </View>

            {step !== 'in_trip' && (
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                <Text style={styles.cancelText}>Bekor qilish</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
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
    shadowOpacity: 0.12, shadowRadius: 4, elevation: 4,
  },
  backIcon: { fontSize: 20, color: '#1F2937' },
  stepPill: {
    flex: 1, backgroundColor: '#fff', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 4,
  },
  stepText: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  bottomSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 12,
  },
  searchingBlock: { alignItems: 'center', paddingVertical: 16, gap: 8 },
  searchingTitle: { fontSize: 17, fontWeight: '700', color: '#1F2937' },
  searchingSub: { fontSize: 14, color: '#6B7280' },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  avatar: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#FACC15',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  driverInfo: { flex: 1 },
  driverName: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  driverCar: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  driverRating: { fontSize: 13, color: '#F59E0B', marginTop: 2 },
  callBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0FDF4',
    alignItems: 'center', justifyContent: 'center',
  },
  callIcon: { fontSize: 18 },
  routeCard: {
    backgroundColor: '#F9FAFB', borderRadius: 12,
    padding: 14, gap: 6, marginBottom: 12,
  },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dotGreen: { color: '#22C55E', fontSize: 16 },
  dotRed: { color: '#EF4444', fontSize: 16 },
  routeAddr: { fontSize: 14, color: '#374151', flex: 1 },
  routeDivider: { height: 1, backgroundColor: '#E5E7EB', marginLeft: 26 },
  metaRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    backgroundColor: '#F9FAFB', borderRadius: 12,
    paddingVertical: 12, marginBottom: 12,
  },
  metaItem: { alignItems: 'center' },
  metaVal: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  metaKey: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  metaDivider: { width: 1, height: 28, backgroundColor: '#E5E7EB' },
  cancelBtn: {
    borderWidth: 1.5, borderColor: '#E5E7EB',
    borderRadius: 12, paddingVertical: 13, alignItems: 'center',
  },
  cancelText: { fontSize: 15, fontWeight: '600', color: '#6B7280' },
})
