import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import reducer from './reducers';

const persistConfig = {
  key: 'root',
  whitelist: [ 'user', 'language' ],
  storage: AsyncStorage
};

const rootReducer = persistReducer(persistConfig, reducer);

export const store = createStore(rootReducer, applyMiddleware(createLogger()));
export const persistor = persistStore(store);
