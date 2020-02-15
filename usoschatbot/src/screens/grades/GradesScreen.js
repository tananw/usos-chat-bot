import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ScrollView, Text } from 'react-native';
import { compose, withSafeAreaView, withHeader, Loader } from '../../components';
import { GRADES_URL } from '../../config/properties';
import Grades from '../home/components/Grades';
import { styles } from '../home/HomeScreen.styles';

const GradesScreen = () => {
  const [ gradesLoading, setGradesLoading ] = useState(true);
  const [ grades, setGrades ] = useState([]);

  const _getGrades = async () => {
    try {
      const response = await axios.get(GRADES_URL);

      setGrades(response.data);
      setGradesLoading(false);
    } catch (err) {
      setGradesLoading(false);
      console.log(err);
    }
  };

  const _renderGrades = () => {
    return grades.map((item, i) => <Grades key={i} gradeInfo={item} />);
  };

  useEffect(
    () => {
      _getGrades();
    },
    [ gradesLoading ]
  );

  if (gradesLoading) {
    return <Loader />;
  }

  return <ScrollView style={styles.container}>{_renderGrades()}</ScrollView>;
};

export default compose(withSafeAreaView, withHeader)(GradesScreen);
