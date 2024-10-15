import React, { useState, useCallback } from 'react';
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
    // 화면에 진입할 때 읽지 않은 알림 수를 알림 목록의 길이로 설정
    setUnreadNotifications(notifications.length);
  }, [notifications]);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const fetchedNotifications = await getNotifications();
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error('알림 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationPress = async (notification) => {
    try {
      await markNotificationAsRead(notification.notificationId);
      await deleteNotification(notification.notificationId);
      // 알림 목록에서 해당 알림 제거
      setNotifications(prevNotifications => 
        prevNotifications.filter(n => n.notificationId !== notification.notificationId)
      );
      // 읽지 않은 알림 수 감소
      setUnreadNotifications(prev => Math.max(0, prev - 1));
      // CounselDetailScreen으로 네비게이트
      navigation.navigate('CounselDetailScreen', { reservationId: notification.reservationId });
    } catch (error) {
      console.error('알림 처리 실패:', error);
    }
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.notificationItem}
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
        keyExtractor={(item) => item.notificationId}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <EmptyScreen message="알림이 없습니다" />
          </View>
        }
        refreshing={isLoading}
        onRefresh={loadNotifications}
        contentContainerStyle={notifications.length === 0 ? styles.emptyList : null} // 알림이 없을 때 중앙 정렬
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
