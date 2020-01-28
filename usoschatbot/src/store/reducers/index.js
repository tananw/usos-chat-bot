import { combineReducers } from 'redux';

import language from './languageReducer';
import user from './userReducer';

export default combineReducers({
  language,
  user
});
