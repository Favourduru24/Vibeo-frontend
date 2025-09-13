import { configureStore } from "@reduxjs/toolkit";
import {setupListeners} from '@reduxjs/toolkit/query'
import {apiSlice} from './api/apiSlice'
import authReducer from '@/features/auth/authSlice'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist'

import storage from 'redux-persist/lib/storage'; // or use secure storage

const persistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token'] // Only persist the token
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

 export const store = configureStore({
     reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
       auth: persistedAuthReducer
     },
     middleware: (getDefaultMiddleware) => getDefaultMiddleware(
           {
            serializableCheck: {
                 ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
           }
     ).concat(apiSlice.middleware)
 })

  export const persistor = persistStore(store)
  setupListeners(store.dispatch)

// import { configureStore } from "@reduxjs/toolkit";
// import {setupListeners} from '@reduxjs/toolkit/query'
// import {apiSlice} from './api/apiSlice'
// import authReducer from '@/features/auth/authSlice'
 

//  export const store = configureStore({
//     reducer: {
//         [apiSlice.reducerPath]: apiSlice.reducer,
//         auth: authReducer,
//         // search: searchSlice,
//     },
//     middleware: getDefaultMiddleware =>
//         getDefaultMiddleware().concat(apiSlice.middleware),
//     devTools: true
// })

// setupListeners(store.dispatch)