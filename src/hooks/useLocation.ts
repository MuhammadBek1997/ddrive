import { useState, useEffect, useRef } from 'react'
import * as Location from 'expo-location'

interface LocationState {
  latitude: number
  longitude: number
  accuracy: number | null
}

interface UseLocationResult {
  location: LocationState | null
  isReady: boolean      // accuracy < 50m bo'lganda true
  isLoading: boolean
  error: string | null
  isInUzbekistan: boolean
}

// O'zbekiston bounding box
const UZ_BOUNDS = {
  minLat: 37.18,
  maxLat: 45.6,
  minLon: 56.0,
  maxLon: 73.13,
}

function isInUzbekistan(lat: number, lon: number): boolean {
  return (
    lat >= UZ_BOUNDS.minLat &&
    lat <= UZ_BOUNDS.maxLat &&
    lon >= UZ_BOUNDS.minLon &&
    lon <= UZ_BOUNDS.maxLon
  )
}

export function useLocation(): UseLocationResult {
  const [location, setLocation] = useState<LocationState | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const watchRef = useRef<Location.LocationSubscription | null>(null)

  useEffect(() => {
    let mounted = true

    async function start() {
      // 1. Ruxsat so'rash
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        if (mounted) {
          setError('Joylashuv ruxsati berilmadi')
          setIsLoading(false)
        }
        return
      }

      // 2. Tezkor taxminiy lokatsiya (network) — darhol xarita ko'rsatish uchun
      try {
        const last = await Location.getLastKnownPositionAsync()
        if (last && mounted) {
          setLocation({
            latitude: last.coords.latitude,
            longitude: last.coords.longitude,
            accuracy: last.coords.accuracy,
          })
        }
      } catch {}

      // 3. GPS warm-up: yuqori aniqlikda kuzatish boshlash
      watchRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 2000,
          distanceInterval: 5,
        },
        (pos) => {
          if (!mounted) return
          const { latitude, longitude, accuracy } = pos.coords

          setLocation({ latitude, longitude, accuracy })
          setIsLoading(false)

          // 50 metrdan aniqroq bo'lsa — tayyor
          if (accuracy !== null && accuracy <= 50) {
            setIsReady(true)
          }
        }
      )
    }

    start().catch(() => {
      if (mounted) {
        setError("Joylashuvni aniqlashda xatolik yuz berdi")
        setIsLoading(false)
      }
    })

    return () => {
      mounted = false
      watchRef.current?.remove()
    }
  }, [])

  return {
    location,
    isReady,
    isLoading,
    error,
    isInUzbekistan: location
      ? isInUzbekistan(location.latitude, location.longitude)
      : true,
  }
}
