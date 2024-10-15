import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import sendGetRequest from '../../axios/SendGetRequest';
import { useAuth } from '../../auth/AuthContext';
import { useCallback } from 'react';
import EmptyScreen from '../EmptyScreen';

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
        console.log(chatRooms);
      },
      /* onFailure: () => {
        setError('채팅방 목록을 가져오는 데 실패했습니다.');
      }, */
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
        <View style={styles.chatRoomContainer}>
          <Image source={{ uri: item.profileImage || "https://via.placeholder.com/80" }} style={styles.image} />
          <View style={styles.infoContainer}>
            <View style={styles.row}>
              <Text style={styles.memberName}>{item.counselorName} 상담사</Text>
              <Text style={styles.createdAt}>{displayText}</Text>
            </View>
              <Text style= {styles.message}>{item.message}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {chatRooms.length === 0 ? <EmptyScreen message="채팅 내역이 없습니다"/>  : <FlatList
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
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginRight: 10,
  },
  chatRoomContainer: {
    flexDirection: 'row',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  createdAt: {
    color: '#666',
    fontSize:16,
    marginRight:10
  },
  message:{
    marginTop:10,
    marginLeft:0,
    fontSize:16
  },
});

export default MemberChattingScreen;
