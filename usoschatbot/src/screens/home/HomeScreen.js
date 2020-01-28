import React from 'react';
import { View, Text } from 'react-native';
import { compose, withSafeAreaView, withHeader } from '../../components';

const HomeScreen = () => {
  return (
    <View>
      <Text>Home Screen</Text>
    </View>
  );
};

export default compose(withSafeAreaView, withHeader)(HomeScreen);
