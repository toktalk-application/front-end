import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import sendGetRequest from '../../axios/SendGetRequest';
import { useAuth } from '../../auth/AuthContext';
import { useCallback } from 'react';

function MemberChattingScreen() {
  const navigation = useNavigation();
  const { state } = useAuth(); // 인증 상태 가져오기
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChatRooms = async () => {
    setLoading(true);
    setError(null);

    // 서버로부터 채팅방 목록 요청
    sendGetRequest({
      token: state.token,
      endPoint: '/chat_rooms', // 채팅방 목록을 가져오는 API 엔드포인트
      onSuccess: (data) => {
        setChatRooms(data); // 가져온 데이터로 상태 업데이트
      },
      onFailure: () => {
        setError('채팅방 목록을 가져오는 데 실패했습니다.');
      },
    });

    setLoading(false);
  };

  // 화면이 포커스될 때마다 데이터를 다시 로드
  useFocusEffect(
    useCallback(() => {
      fetchChatRooms();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>오류: {error}</Text>
      </View>
    );
  }

  const handleChatRoomPress = (roomId, memberNickname, counselorName) => {
    navigation.navigate('ChatRoom', { roomId, memberNickname, counselorName });
  };

  const renderItem = ({ item }) => {
    const createdDate = new Date(item.createdAt);
    const today = new Date();
    const isToday = createdDate.toDateString() === today.toDateString();
    const displayText = isToday
      ? createdDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      : createdDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });

    return (
      <TouchableOpacity
        style={styles.chatRoom}
        onPress={() => handleChatRoomPress(item.roomId, item.memberNickname, item.counselorName)}
      >
        <View style={styles.row}>
          <Text style={styles.memberName}>{item.counselorName} 상담사</Text>
          <Text style={styles.createdAt}>{displayText}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {chatRooms.length === 0 ? <View><Text>채팅이 없습니다.</Text></View> : <FlatList
        data={chatRooms}
        keyExtractor={(item) => item.roomId.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  listContainer: {
    padding: 10,
  },
  chatRoom: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  createdAt: {
    color: '#666',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MemberChattingScreen;
