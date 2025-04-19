import React from 'react';
import { useNotification } from '../../hooks/useNotification';
import '../../assets/styles/notification.css';

const NotificationToast: React.FC = () => {
  const { notification } = useNotification();

  if (!notification) return null;

  return (
    <div className={`toast toast-${notification.type}`}>
      {notification.message}
    </div>
  );
};

export default NotificationToast;