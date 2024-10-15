import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchNotifications } from './notificationApi';
import { useFocusEffect } from '@react-navigation/native';

const NotificationIcon = ({ navigation }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  // useEffect(() => {
  //   const loadUnreadCount = async () => {
  //     try {
  //       const notifications = await fetchNotifications();
  //       const unread = notifications.filter(n => !n.isRead).length;
  //       setUnreadCount(unread);
  //     } catch (error) {
  //       console.error('알림 수 가져오기 실패:', error);
  //     }
  //   };

  //   loadUnreadCount();
  //   // 여기에 주기적으로 알림을 확인하는 로직을 추가할 수 있습니다.
  // }, []);

  useFocusEffect(
    useCallback(() => {
      const loadUnreadCount = async () => {
        try {
          const notifications = await fetchNotifications();
          const unread = notifications.filter(n => !n.isRead).length;
          setUnreadCount(unread);
        } catch (error) {
          console.error('알림 수 가져오기 실패:', error);
        }
      };
  
      loadUnreadCount();
      // 여기에 주기적으로 알림을 확인하는 로직을 추가할 수 있습니다.
    }, [])
  );

  return (
    <View style={styles.container}>
      <Icon name="notifications-outline" size={24} color="#000" />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default NotificationIcon;