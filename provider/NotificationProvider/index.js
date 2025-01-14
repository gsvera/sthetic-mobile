import {
  useState,
  useContext,
  createContext,
  useCallback,
  useEffect,
} from "react";
import MiniNotification from "../../components/Shared/Notifications/MiniNotification";

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [dataNotification, setDataNotification] = useState();

  const handleNotification = useCallback((data) => {
    setDataNotification(data);
    setShowNotification(true);
  });

  useEffect(() => {
    if (showNotification) {
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    } else {
    }
  }, [showNotification, dataNotification]);

  return (
    <NotificationContext.Provider value={{ handleNotification }}>
      {showNotification && (
        <MiniNotification
          type={dataNotification?.type}
          message={dataNotification?.message}
        />
      )}
      {children}
    </NotificationContext.Provider>
  );
};

const useNotificationProvider = () => {
  return useContext(NotificationContext);
};

export { NotificationProvider, useNotificationProvider };
