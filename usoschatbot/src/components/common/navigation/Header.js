import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MenuIcon } from '../../Icons';

const Header = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.headerMenuButton} onPress={() => navigation.toggleDrawer()}>
        <MenuIcon height={32} width={32} fill="#000000" />
      </TouchableOpacity>
      <Text style={styles.screenTitle}>Header</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    alignItems: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row'
  },
  headerMenuButton: {
    marginRight: 8
  },
  screenTitle: {
    fontFamily: 'SFProText-Regular',
    fontSize: 17,
    lineHeight: 22,
    color: '#666666'
  }
});

export default Header;
