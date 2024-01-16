import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import { persistReducer,persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'



//we will add redux persist : when we refresh the page the session dosent log out:
const rootReducer= combineReducers({user:userReducer})
// persist configuting the paramaters in the local storage:
const persistConfig={
    key:'root',
    storage,
    version:1,
}
const persistedReducer= persistReducer(persistConfig,rootReducer)


export const store = configureStore({
    //now we can add the user after coding the userslice
  // after we add the redux-persist it changed :reducer: {user:userReducer},
  reducer: persistedReducer,
  //provides a way to extend the Redux capabilities
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    //ensure that actions and state are serializable
    serializableCheck: false,
}),
})
//we must export this constant relate to redux-persistant:
export const persistor = persistStore(store);