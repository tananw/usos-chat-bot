import React from 'react';
import { View } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';

export default function withSafeAreaView(WrappedComponent) {
  return (props) => {
    const insets = useSafeArea();

    return (
      <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom, flex: 1 }}>
        <WrappedComponent {...props} />
      </View>
    );
  };
}
