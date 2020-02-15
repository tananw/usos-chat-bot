import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const Grades = ({ gradeInfo }) => {
  const { modification_author: { first_name, last_name }, passes, value_symbol } = gradeInfo;
  const { t } = useTranslation();

  return (
    <View style={styles.gradeContainer}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ minWidth: '50%' }}>
          <Text style={styles.labelText}>{t('Leader')}</Text>
          <Text style={styles.infoText}>{`${first_name} ${last_name}`}</Text>
        </View>
        <View style={{ minWidth: '25%' }}>
          <Text style={styles.labelText}>{t('Grade')}</Text>
          <Text style={styles.infoText}>{value_symbol}</Text>
        </View>
        <View style={{ minWidth: '25%' }}>
          <Text />
          {passes ? (
            <Text style={{ ...styles.infoText, ...styles.passedExam }}>{t('Passed')}</Text>
          ) : (
            <Text style={{ ...styles.infoText, ...styles.notPassed }}>{t('NotPassed')}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gradeContainer: {
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 8
  },
  labelText: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: 'SFProText-Regular'
  },
  infoText: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'SFProText-Regular'
  },
  passedExam: {
    color: 'green'
  },
  notPassed: {
    color: 'red'
  }
});

export default Grades;
