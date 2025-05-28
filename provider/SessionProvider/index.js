import { useState, useContext, createContext, useEffect } from "react";
import {
  getStoreSession,
  KEY_STORE,
  setStoreSession,
} from "@/hooks/StoreDataSecure";
import { useApiProvider } from "../InterceptorProvider";

const SessionContext = createContext();

const SessionProvider = ({ children }) => {
  const { token } = useApiProvider();

  const [storeSessionProvider, setStoreSessionProvider] = useState(null);

  useEffect(() => {
    getStoreSession({ key: KEY_STORE.idUser }).then((value) => {
      if (value) {
        setStoreSessionProvider((prev) => ({ ...prev, idUser: value }));
      }
    });
  }, [token]);

  return (
    <SessionContext.Provider
      value={{
        storeSessionProvider,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

const useSessionProvider = () => {
  return useContext(SessionContext);
};

export { SessionProvider, useSessionProvider };
