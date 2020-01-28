import { StyleSheet } from 'react-native';
import * as colors from '../../styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 32,
    justifyContent: 'center'
  },
  header: {
    marginVertical: 40
  },
  headerWrapper: {
    marginBottom: 16
  },
  headerText: {
    fontFamily: 'SFProText-Bold',
    fontSize: 40,
    lineHeight: 48,
    color: colors.HEADER_COLOR
  },
  subHeaderText: {
    fontFamily: 'SFProText-Regular',
    fontSize: 17,
    lineHeight: 22,
    color: colors.SUB_HEADER_COLOR
  },
  authorizeButton: {
    height: 50,
    borderRadius: 8,
    backgroundColor: colors.BUTTON_FILLED_BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25
  },
  authorizeButtonText: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 17,
    lineHeight: 22,
    color: colors.BUTTON_FILLED_TEXT_COLOR
  }
});
