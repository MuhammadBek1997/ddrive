import { Pressable, Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { HomeScreen, OrdersScreen, ProfileScreen } from '../flows/ClientFlow'
import { DeliveryHomeScreen } from '../flows/GapsFlow'
import { useTheme } from '../ui/theme'

const Tab = createBottomTabNavigator()

const TABS = [
  { name: 'Taksi', label: 'Taksi', icon: '⌂', component: HomeScreen },
  { name: 'Yetkazish', label: 'Yetkazish', icon: '▣', component: DeliveryHomeScreen },
  { name: 'Tarix', label: 'Tarix', icon: '☰', component: OrdersScreen },
  { name: 'Profil', label: 'Profil', icon: '☺', component: ProfileScreen },
]

export default function TabNavigator() {
  const { colors } = useTheme()
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarShowLabel: false }}
      tabBar={({ state, navigation }) => (
        <View style={{ flexDirection: 'row', backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 6, paddingBottom: 10 }}>
          {TABS.map((tab, index) => {
            const focused = state.index === index
            return (
              <Pressable key={tab.name} onPress={() => navigation.navigate(tab.name)} style={{ flex: 1, alignItems: 'center', gap: 2 }}>
                <Text style={{ color: focused ? colors.accent : colors.secondary, fontSize: 16 }}>{tab.icon}</Text>
                <Text style={{ color: focused ? colors.accent : colors.secondary, fontSize: 10, fontWeight: '600' }}>{tab.label}</Text>
              </Pressable>
            )
          })}
        </View>
      )}
    >
      {TABS.map((tab) => <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />)}
    </Tab.Navigator>
  )
}
