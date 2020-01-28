import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

const Button = ({ onPress, text, btnStyle, textStyle }) => {
  return (
    <TouchableOpacity onPress={onPress} style={btnStyle}>
      <Text style={textStyle}>{text}</Text>
    </TouchableOpacity>
  );
};

Button.propTypes = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  btnStyle: PropTypes.object,
  textStyle: PropTypes.object
};

export default Button;
