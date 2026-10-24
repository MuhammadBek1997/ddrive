import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TabNavigator from './TabNavigator'
import { CourierSendScreen, NotificationsScreen, ServicesScreen, SettingsScreen } from '../flows/ClientFlow'
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
    </Stack.Navigator>
  )
}
