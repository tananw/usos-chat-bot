import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Alert } from 'react-native';
import { compose, withSafeAreaView, withHeader, Loader } from '../../components';
import ProfileInformations from './components/ProfileInformations';

import { styles } from './HomeScreen.styles';

import { useTranslation } from 'react-i18next';
import { USER_URL, GRADES_URL } from '../../config/properties';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../../store/reducers/userReducer';
import Grades from './components/Grades';

const HomeScreen = () => {
  const { t } = useTranslation();
  const [ loading, setLoading ] = useState(true);
  const [ gradesLoading, setGradesLoading ] = useState(true);
  const [ firstName, setFirstName ] = useState('');
  const [ lastName, setLastName ] = useState('');
  const [ hasPhoto, setHasPhoto ] = useState(false);
  const [ profilePhoto, setProfilePhoto ] = useState('');
  const [ grades, setGrades ] = useState([]);

  const userData = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const _getUserInformations = async () => {
    try {
      const response = await axios.get(USER_URL);

      const { first_name, last_name, has_photo } = response.data;

      if (first_name && last_name) {
        setFirstName(first_name);
        setLastName(last_name);
      }

      if (has_photo) {
        setHasPhoto(true);
        setProfilePhoto(response.data.photo_urls['50x50']);
      }
      setLoading(false);
      return response;
    } catch (err) {
      setLoading(false);
      Alert.alert(t('Problem'), err);
      return err;
    }
  };

  const _getGrades = async () => {
    try {
      const response = await axios.get(GRADES_URL);

      dispatch(
        setUserData({
          ...userData,
          grades: response.data
        })
      );
      setGrades(response.data);
      setGradesLoading(false);
    } catch (err) {
      setGradesLoading(false);
      console.log(err);
    }
  };

  const _renderFiveLastGrades = () => {
    const arr = [];
    for (let i = 0; i < 9; i++) {
      arr.push(<Grades gradeInfo={grades[i]} />);
    }

    return arr;
  };

  useEffect(
    () => {
      _getUserInformations();
      _getGrades();
    },
    [ loading ]
  );

  if (loading || gradesLoading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <ProfileInformations firstName={firstName} lastName={lastName} profilePhoto={profilePhoto} hasPhoto={hasPhoto} />
      {_renderFiveLastGrades()}
    </View>
  );
};

export default compose(withSafeAreaView, withHeader)(HomeScreen);
