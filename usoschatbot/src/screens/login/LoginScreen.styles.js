import { StyleSheet } from 'react-native';
import * as colors from '../../styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 32
  },
  header: {
    marginVertical: 56
  },
  headerText: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 40,
    lineHeight: 48,
    color: 'rgba(0, 0, 0, 0.75)',
    textAlign: 'center'
  },
  loginButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.BUTTON_BORDER_COLOR,
    borderWidth: 1,
    borderRadius: 10
  },
  loginButtonText: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 17,
    lineHeight: 22,
    color: colors.BUTTON_TEXT_COLOR
  }
});
