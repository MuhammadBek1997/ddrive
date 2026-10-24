import { createNativeStackNavigator } from '@react-navigation/native-stack'
import {
  BecomePartnerScreen,
  ForgotPasswordScreen,
  LoginScreen,
  RegisterAccountScreen,
  RegisterCodeScreen,
  RegisterNameScreen,
  RegisterSuccessScreen,
  RegisterTermsScreen,
  WelcomeScreen,
} from '../flows/AuthFlow'

const Stack = createNativeStackNavigator()

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RegisterName" component={RegisterNameScreen} />
      <Stack.Screen name="RegisterAccount" component={RegisterAccountScreen} />
      <Stack.Screen name="RegisterCode" component={RegisterCodeScreen} />
      <Stack.Screen name="RegisterTerms" component={RegisterTermsScreen} />
      <Stack.Screen name="RegisterSuccess" component={RegisterSuccessScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="BecomePartner" component={BecomePartnerScreen} />
    </Stack.Navigator>
  )
}
