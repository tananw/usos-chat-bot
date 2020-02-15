import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';

const ProfileInformations = ({ firstName, lastName, profilePhoto, hasPhoto }) => {
  return (
    <View style={styles.profileInformations}>
      <View style={styles.profilePhoto}>
        {hasPhoto ? (
          <Image style={styles.profilePhoto} source={{ uri: profilePhoto }} />
        ) : (
          <View style={styles.profilePhoto} />
        )}
      </View>
      <Text style={styles.profileInformationsText}>{`${firstName} ${lastName}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  profileInformations: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profilePhoto: {
    width: 50,
    height: 50,
    backgroundColor: '#D8D8D8',
    borderRadius: 100,
    marginRight: 10
  },
  profileInformationsText: {
    fontFamily: 'SFProText-Regular',
    fontSize: 17,
    lineHeight: 22
  }
});

export default ProfileInformations;
