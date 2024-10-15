import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

export const configureNotifications = (setUnreadNotifications) => {
  console.log('configureNotifications called, setUnreadNotifications type:', typeof setUnreadNotifications);

  const createChannel = async () => {
    try {
      await notifee.createChannel({
        id: '1',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
      console.log('Notification channel created successfully');
    } catch (error) {
      console.error('Error creating notification channel:', error);
    }
  };

  createChannel();

  const handleNewNotification = async (remoteMessage) => {
    console.log('New notification received', remoteMessage);
    if (typeof setUnreadNotifications === 'function') {
        setUnreadNotifications(prev => prev + 1);
      } else {
        console.log('setUnreadNotifications is not a function');
      }

    try {
      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        android: {
          channelId: '1',
          pressAction: { id: 'default' },
        },
      });
    } catch (error) {
      console.error('Error displaying notification:', error);
    }
  };

  const unsubscribeForeground = messaging().onMessage(handleNewNotification);
  messaging().setBackgroundMessageHandler(handleNewNotification);

  return () => unsubscribeForeground();
};