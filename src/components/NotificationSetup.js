import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { useNotification } from './NotificationContext';

const NotificationSetup = () => {
  const { setUnreadNotifications } = useNotification();  // 이 부분에서 올바르게 가져오는지 확인

  useEffect(() => {
    const createChannel = async () => {
      await notifee.createChannel({
        id: '1',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
    };
    createChannel();

    const handleNewNotification = async (remoteMessage) => {
      console.log('New notification received', remoteMessage);
      if (typeof setUnreadNotifications === 'function') {
        setUnreadNotifications(prev => prev + 1);
      } else {
        console.log('setUnreadNotifications is not a function');
      }

      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        android: {
          channelId: '1',
          pressAction: { id: 'default' },
        },
      });
    };

    const unsubscribeForeground = messaging().onMessage(handleNewNotification);

    messaging().setBackgroundMessageHandler(handleNewNotification);

    return () => unsubscribeForeground();
  }, [setUnreadNotifications]);

  return null;
};

export default NotificationSetup;
