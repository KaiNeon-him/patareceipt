import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CreateReceiptScreen from '../screens/CreateReceiptScreen';
import ReceiptDetailScreen from '../screens/ReceiptDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import VerifyScreen from '../screens/VerifyScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import TemplatesScreen from '../screens/TemplatesScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="CreateReceipt" component={CreateReceiptScreen} />
            <Stack.Screen name="ReceiptDetail" component={ReceiptDetailScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Verify" component={VerifyScreen} />
            <Stack.Screen name="Analytics" component={AnalyticsScreen} />
            <Stack.Screen name="Templates" component={TemplatesScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}