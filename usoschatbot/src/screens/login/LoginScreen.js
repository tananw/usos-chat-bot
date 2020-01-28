import React, { useState } from 'react';
import { View, Text, Alert, Linking } from 'react-native';
import axios from 'axios';

import { useTranslation } from 'react-i18next';
import { compose, withSafeAreaView, Button, Loader } from '../../components';

import { LOGIN_URL } from '../../config/properties';
import { styles } from './LoginScreen.styles';

const LoginScreen = ({ navigation }) => {
  const [ loading, setLoading ] = useState(false);
  const { t } = useTranslation();

  const _loginHandler = () => {
    _getLoginUrl();
  };

  const _getLoginUrl = async () => {
    try {
      setLoading(true);
      const response = await axios.get(LOGIN_URL);

      const { data } = response;
      const { url } = data;

      _getLoginUrlCallback(null, url);
      return response;
    } catch (err) {
      console.log(err);
      Alert.alert('Problem', t('RequestError'));
    } finally {
      setLoading(false);
    }
  };

  const _getLoginUrlCallback = (error, url) => {
    if (!error) {
      Linking.canOpenURL(url)
        .then((supported) => {
          if (supported) {
            Linking.openURL(url);
          } else {
            Alert.alert('Problem', t('UnsupportedPhone'));
          }
        })
        .then(() => {
          navigation.navigate('Authorize');
        });
    } else {
      Alert.alert('Problem', t('RequestError'));
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{t('AppName')}</Text>
      </View>
      <Button
        onPress={_loginHandler}
        text={t('LogIn')}
        btnStyle={styles.loginButton}
        textStyle={styles.loginButtonText}
      />
    </View>
  );
};

export default compose(withSafeAreaView)(LoginScreen);
