import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTranslation } from 'react-i18next';

import HomeScreen from '../screens/home/HomeScreen';
import GradesScreen from '../screens/grades/GradesScreen';
import ScheduleScreen from '../screens/schedule/ScheduleScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const { t } = useTranslation();

  return (
    <Drawer.Navigator initialRouteName={t('HomeScreen')}>
      <Drawer.Screen name={t('HomeScreen')} component={HomeScreen} />
      <Drawer.Screen name={t('GradesScreen')} component={GradesScreen} />
      <Drawer.Screen name={t('ScheduleScreen')} component={ScheduleScreen} />
    </Drawer.Navigator>
  );
}
