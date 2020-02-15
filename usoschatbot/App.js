import React from 'react';
import { StatusBar } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';

import i18n from 'i18next';
import * as RNLocalize from 'react-native-localize';
import { initReactI18next } from 'react-i18next';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';

import MainNavigator from './src/navigators/MainNavigator';
import { Loader } from './src/components';

enableScreens();

console.disableYellowBox = true;

i18n.use(initReactI18next).init({
  resources: {
    pl: require('./src/translations/pl.json'),
    en: require('./src/translations/en.json')
  },
  lng: RNLocalize.getLocales()[0].languageCode,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        <NavigationContainer>
          <StatusBar translucent barStyle="dark-content" backgroundColor="transparent" />
          <MainNavigator />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
