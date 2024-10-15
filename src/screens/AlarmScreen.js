import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getNotifications, markNotificationAsRead, deleteNotification } from './notificationService';
import { useNotification } from '../components/NotificationContext';
import EmptyScreen from './EmptyScreen';

const AlarmScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { setUnreadNotifications } = useNotification();

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );

  useEffect(() => {
    setUnreadNotifications(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const fetchedNotifications = await getNotifications();
      const validatedNotifications = fetchedNotifications.map(notification => ({
        ...notification,
        notificationId: notification.notificationId || `temp-${Date.now()}-${Math.random()}`
      }));
      setNotifications(validatedNotifications);
    } catch (error) {
      console.error('알림 로드 실패:', error);
      Alert.alert('오류', '알림을 불러오는 데 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationPress = async (notification) => {
    try {
      await markNotificationAsRead(notification.notificationId);
      await deleteNotification(notification.notificationId);
      
      setNotifications(prevNotifications => 
        prevNotifications.filter(n => n.notificationId !== notification.notificationId)
      );
      
      setUnreadNotifications(prev => Math.max(0, prev - 1));
      
      switch (notification.type) {
        case 'RESERVATION':
          console.log('Reservation ID:', notification.reservationId);
          navigation.navigate('CounselDetailScreen', { reservationId: notification.reservationId });
          break;
        case 'CHAT':
          navigation.navigate('ChatRoomScreen', { roomId: notification.roomId });
          break;
        default:
          console.warn('알 수 없는 알림 타입:', notification.type);
          Alert.alert('알림', '지원하지 않는 알림 유형입니다.');
      }
    } catch (error) {
      console.error('알림 처리 실패:', error);
      Alert.alert('오류', '알림 처리 중 문제가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, item.read && styles.readNotification]}
      onPress={() => handleNotificationPress(item)}
    >
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationBody}>{item.body}</Text>
      <Text style={styles.notificationDate}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.notificationId || `notification-${item.createdAt}`}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <EmptyScreen message="알림이 없습니다" />
          </View>
        }
        refreshing={isLoading}
        onRefresh={loadNotifications}
        contentContainerStyle={notifications.length === 0 ? styles.emptyList : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationItem: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  readNotification: {
    backgroundColor: '#e0e0e0',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notificationBody: {
    fontSize: 14,
    marginBottom: 5,
  },
  notificationDate: {
    fontSize: 12,
    color: '#666',
  },
});

export default AlarmScreen;
