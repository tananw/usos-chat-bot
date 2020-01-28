import React from 'react';
import { Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { height } = Dimensions.get('screen');

export default function withKeyboardAware(WrappedComponent) {
  return (props) => {
    return (
      <KeyboardAwareScrollView contentContainerStyle={{ height: height }}>
        <WrappedComponent {...props} />
      </KeyboardAwareScrollView>
    );
  };
}
