'use client'
import { Provider } from "react-redux"
import { PersistGate } from 'redux-persist/lib/integration/react';
import { store, persistor} from "@/app/store"
import PersistLogin from "@/features/auth/PersistLogin"
import Prefetch from "@/features/auth/Prefetch"

const Session = ({children}) => {
  return (
    <Provider store={store}>
       <PersistGate loading={null} persistor={persistor}>
         <PersistLogin>
          <Prefetch>
           {children}
          </Prefetch>
         </PersistLogin>
        </PersistGate>
    </Provider>
  )
}

export default Session