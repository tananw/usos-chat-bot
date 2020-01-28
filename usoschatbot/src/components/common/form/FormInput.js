import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import * as colors from '../../../styles/colors';
import PropTypes from 'prop-types';

const FormInput = ({ text, value, setValue, placeholder, isSecure, isEmail, isPhone, isNumber }) => {
  const [ focused, setFocused ] = useState(false);

  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{text}</Text>
      <TextInput
        style={
          focused ? (
            { ...styles.formInput, borderBottomColor: '#000000' }
          ) : (
            { ...styles.formInput, borderBottomColor: '#EFEFF4' }
          )
        }
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChangeText={(text) => setValue(text)}
        placeholder={placeholder}
        placeholderTextColor={colors.FORM_PLACEHOLDER_GRAY_COLOR}
        {...isSecure && { secureTextEntry: true }}
        {...isEmail && { keyboardType: 'email-address' }}
        {...isPhone && { keyboardType: 'phone-pad' }}
        {...isNumber && { keyboardType: 'number-pad' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 25,
    height: 64
  },
  label: {
    fontFamily: 'SFProText-Regular',
    fontSize: 17,
    lineHeight: 22,
    color: colors.FORM_LABEL_GRAY_COLOR
  },
  formInput: {
    borderBottomWidth: 1,
    paddingTop: 8,
    paddingBottom: 11,
    color: colors.FORM_INPUT_BLACK_COLOR
  }
});

FormInput.propTypes = {
  text: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  isSecure: PropTypes.bool,
  isEmail: PropTypes.bool,
  isPhone: PropTypes.bool,
  isNumber: PropTypes.bool
};

FormInput.defaultProps = {
  isSecure: false,
  isEmail: false,
  isPhone: false,
  isNumber: false
};
export default FormInput;
