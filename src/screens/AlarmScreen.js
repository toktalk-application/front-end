import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getNotifications, markNotificationAsRead } from './notificationService';

const AlarmScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const fetchedNotifications = await getNotifications();
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error('알림 로드 실패:', error);
      Alert.alert('오류', '알림을 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(notifications.map(notification => 
        notification.notificationId === notificationId 
          ? { ...notification, isRead: true } 
          : notification
      ));
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
      Alert.alert('오류', '알림 읽음 처리에 실패했습니다.');
    }
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, item.isRead && styles.readNotification]}
      onPress={() => handleMarkAsRead(item.notificationId)}
    >
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationBody}>{item.body}</Text>
      <Text style={styles.notificationDate}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text>알림을 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.notificationId}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text>알림이 없습니다.</Text>
          </View>
        }
        refreshing={isLoading}
        onRefresh={loadNotifications}
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
    flex: 1,
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