import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TabNavigator from './TabNavigator'
import { CourierSendScreen, NotificationsScreen, SearchScreen, ServicesScreen, SettingsScreen } from '../flows/ClientFlow'
import { CargoBookingScreen, CargoConfirmedScreen, CargoOffersScreen, CargoTrackingScreen } from '../flows/CargoFlow'
import {
  CartScreen,
  CategoryScreen,
  CheckoutScreen,
  ConfirmedScreen,
  DeliveredScreen,
  ItemScreen,
  MedicineScreen,
  ProductScreen,
  RestaurantScreen,
  RestaurantsScreen,
  TrackingScreen,
} from '../flows/MarketFlow'
import {
  DestinationScreen,
  DriverFoundScreen,
  LiveRideScreen,
  RatingScreen,
  SearchingScreen,
  TariffsScreen,
} from '../flows/TaxiFlow'
import {
  CancelRideScreen,
  ChatScreen,
  CourierMissingScreen,
  DeliveryTrackScreen,
  DriverCancelledScreen,
  FreeWaitScreen,
  HandoverCodeScreen,
  IntercityOffersScreen,
  IntercityScreen,
  LocationPermissionScreen,
  NothingFoundScreen,
  NotifyPermissionScreen,
  OutOfAreaScreen,
  PartnerServicesScreen,
  PeregonScreen,
  PeregonStatusScreen,
  PinLandmarkScreen,
  PriceChangedScreen,
  RideOfflineScreen,
  SosScreen,
  TaxiTimeoutScreen,
} from '../flows/GapsFlow'

const Stack = createNativeStackNavigator()

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="Services" component={ServicesScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="CourierSend" component={CourierSendScreen} />
      <Stack.Screen name="Destination" component={DestinationScreen} />
      <Stack.Screen name="Tariffs" component={TariffsScreen} />
      <Stack.Screen name="Searching" component={SearchingScreen} />
      <Stack.Screen name="DriverFound" component={DriverFoundScreen} />
      <Stack.Screen name="LiveRide" component={LiveRideScreen} />
      <Stack.Screen name="Rating" component={RatingScreen} />
      <Stack.Screen name="Restaurants" component={RestaurantsScreen} />
      <Stack.Screen name="Restaurant" component={RestaurantScreen} />
      <Stack.Screen name="Item" component={ItemScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Confirmed" component={ConfirmedScreen} />
      <Stack.Screen name="Tracking" component={TrackingScreen} />
      <Stack.Screen name="Delivered" component={DeliveredScreen} />
      <Stack.Screen name="Category" component={CategoryScreen} />
      <Stack.Screen name="Product" component={ProductScreen} />
      <Stack.Screen name="Medicine" component={MedicineScreen} />
      <Stack.Screen name="CargoBooking" component={CargoBookingScreen} />
      <Stack.Screen name="CargoOffers" component={CargoOffersScreen} />
      <Stack.Screen name="CargoConfirmed" component={CargoConfirmedScreen} />
      <Stack.Screen name="CargoTracking" component={CargoTrackingScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="NotifyPermission" component={NotifyPermissionScreen} />
      <Stack.Screen name="TaxiTimeout" component={TaxiTimeoutScreen} />
      <Stack.Screen name="OutOfArea" component={OutOfAreaScreen} />
      <Stack.Screen name="CancelRide" component={CancelRideScreen} />
      <Stack.Screen name="DriverCancelled" component={DriverCancelledScreen} />
      <Stack.Screen name="RideOffline" component={RideOfflineScreen} />
      <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} />
      <Stack.Screen name="PinLandmark" component={PinLandmarkScreen} />
      <Stack.Screen name="PriceChanged" component={PriceChangedScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Sos" component={SosScreen} />
      <Stack.Screen name="FreeWait" component={FreeWaitScreen} />
      <Stack.Screen name="NothingFound" component={NothingFoundScreen} />
      <Stack.Screen name="HandoverCode" component={HandoverCodeScreen} />
      <Stack.Screen name="DeliveryTrack" component={DeliveryTrackScreen} />
      <Stack.Screen name="CourierMissing" component={CourierMissingScreen} />
      <Stack.Screen name="Peregon" component={PeregonScreen} />
      <Stack.Screen name="PeregonStatus" component={PeregonStatusScreen} />
      <Stack.Screen name="Intercity" component={IntercityScreen} />
      <Stack.Screen name="IntercityOffers" component={IntercityOffersScreen} />
      <Stack.Screen name="PartnerServices" component={PartnerServicesScreen} />
    </Stack.Navigator>
  )
}
