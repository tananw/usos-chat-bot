import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, Alert } from 'react-native';
import { withSafeAreaView, compose, FormInput, withKeyboardAware, Button, Loader } from '../../components';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { styles } from './AuthorizeScreen.styles';
import { AUTHORIZE_URL } from '../../config/properties';
import { setUserData } from '../../store/reducers/userReducer';

const AuthorizeScreen = ({ navigation }) => {
  const [ pin, setPin ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const { t } = useTranslation();
  const isAuthorized = useSelector((state) => state.user.isAuthorized);
  const dispatch = useDispatch();

  useEffect(
    () => {
      if (isAuthorized) {
        navigation.navigate('HomeScreen');
      }
    },
    [ isAuthorized ]
  );

  const _submitAuthorizationForm = () => {
    _authorizeUser();
  };

  const _authorizeUser = async () => {
    try {
      setLoading(true);
      const response = await axios.post(AUTHORIZE_URL, {
        pin: String(pin)
      });

      const { data } = response;

      dispatch(
        setUserData({
          isAuthorized: true,
          accessToken: data.access_token
        })
      );

      _authorizationCallback(null, data);
      return response;
    } catch (err) {
      Alert.alert('Problem', t('RequestError'));
    } finally {
      setLoading(false);
    }
  };

  const _authorizationCallback = (error, data) => {
    if (!error) {
      navigation.navigate('HomeScreen');
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
        <View style={styles.headerWrapper}>
          <Text style={styles.headerText}>{t('AuthorizeHeader')}</Text>
        </View>
        <Text style={styles.subHeaderText}>{t('AuthorizeSubHeader')}</Text>
      </View>
      <View style={styles.authorizeForm}>
        <FormInput
          text={t('AuthorizeLabel')}
          placeholder={t('AuthorizePlaceholder')}
          value={pin}
          setValue={(text) => setPin(text)}
          isNumber
        />
        <Button
          onPress={_submitAuthorizationForm}
          text={t('Authorize')}
          btnStyle={styles.authorizeButton}
          textStyle={styles.authorizeButtonText}
        />
      </View>
    </View>
  );
};

export default compose(withKeyboardAware, withSafeAreaView)(AuthorizeScreen);
