import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/login/LoginScreen';
import AuthorizeScreen from '../screens/authorize/AuthorizeScreen';
import DrawerNavigator from './HomeNavigator';

const Stack = createStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" headerMode="none">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Authorize" component={AuthorizeScreen} />
      <Stack.Screen name="HomeScreen" component={DrawerNavigator} />
    </Stack.Navigator>
  );
}
