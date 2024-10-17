import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import sendGetRequest from '../../axios/SendGetRequest';
import { useAuth } from '../../auth/AuthContext';
import { useCallback } from 'react';
import EmptyScreen from '../EmptyScreen';
import LoadingScreen from '../LoadingScreen';

function MemberChattingScreen() {
  const navigation = useNavigation();
  const { state } = useAuth(); // 인증 상태 가져오기
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

    setIsLoading(false);
  };

  // 화면이 포커스될 때마다 데이터를 다시 로드
  useFocusEffect(
    useCallback(() => {
      fetchChatRooms();
    }, [])
  );

  
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>오류: {error}</Text>
      </View>
    );
  }

  const handleChatRoomPress = (roomId, memberNickname, counselorName, roomStatus) => {
    navigation.navigate('ChatRoom', { roomId, memberNickname, counselorName, roomStatus });
  };

  const renderItem = ({ item }) => {
    // createdAt이 null일 경우 createdDate를 null로 설정
    const createdDate = item.createdAt ? new Date(item.createdAt) : null; 
    const today = new Date();
    
    // createdDate가 유효할 경우에만 날짜를 포맷팅
    const displayText = createdDate 
      ? (createdDate.toDateString() === today.toDateString()
        ? createdDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        : createdDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' }))
      : null; // createdAt이 null일 경우 null로 설정

    const roomStatusBackgroundColor = item.roomStatus === 'open' ? '#215D9A' : '#CA6767';

    return (
      <TouchableOpacity
        style={styles.chatRoom}
        onPress={() => handleChatRoomPress(item.roomId, item.memberNickname, item.counselorName, item.roomStatus)}
      >
        <View style={styles.chatRoomContainer}>
          <Image source={{ uri: item.profileImage || "https://via.placeholder.com/80" }} style={styles.profileImage} />
          <View style={styles.infoContainer}>
            <Text style={styles.memberName}>{item.counselorName} 상담사</Text>
            <Text style={styles.messagePreview}>
              {item.message ? (item.message.length > 15 ? item.message.substring(0, 15) + '...' : item.message) : ''}
            </Text>
          </View>
          <View style={styles.rightContainer}>
            <View style={[styles.statusBadge, { backgroundColor: roomStatusBackgroundColor }]}>
              <Text style={styles.statusText}>{item.roomStatus === 'open' ? 'Open' : 'Closed'}</Text>
            </View>
            <Text style={styles.createdAt}>{displayText}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? ( 
        <LoadingScreen message={'채팅 정보를 불러오는 중입니다..'} />
      ) : chatRooms.length === 0 ? <EmptyScreen message="채팅 내역이 없습니다"/>  : <FlatList
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
    paddingVertical: 10,
  },
  chatRoom: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  chatRoomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop:8
  },
  rightContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom:7
  },
  memberName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  messagePreview: {
    color: '#666',
    fontSize: 14,
    marginTop: 10,
    maxWidth: '100%',
  },
  createdAt: {
    color: '#999',
    fontSize: 13,
    textAlign: 'right',
    minWidth: 80,
    marginRight: 3, 
    marginRight: 10,
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom:10,
    minWidth: 80,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default MemberChattingScreen;
