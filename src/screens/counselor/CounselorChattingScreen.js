import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import sendGetRequest from '../../axios/SendGetRequest';
import { useAuth } from '../../auth/AuthContext';
import { useCallback } from 'react';
import EmptyScreen from '../EmptyScreen';
import LoadingScreen from '../LoadingScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';

function CounselorChattingScreen() {
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
    return <LoadingScreen message={'채팅 정보를 불러오는 중 입니다..'} />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>오류: {error}</Text>
      </View>
    );
  }

  const handleChatRoomPress = (roomId, nickname, counselorName, roomStatus) => {
    navigation.navigate('ChatRoom', { roomId, nickname, counselorName, roomStatus });
  };

  const renderItem = ({ item }) => {
    const createdDate = item.createdAt ? new Date(item.createdAt) : null; 
    const today = new Date();

    const displayText = createdDate 
      ? (createdDate.toDateString() === today.toDateString()
        ? createdDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        : createdDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' }))
      : null; // createdAt이 null일 경우 null로 설정

    // 상태에 따른 뱃지 색상 및 텍스트 설정
    const statusText = item.roomStatus === 'open' ? 'Open' : 'Closed';
    const statusBackgroundColor = item.roomStatus === 'open' ? '#215D9A' : '#CA6767';

    return (
      <TouchableOpacity
        style={styles.chatRoom}
        onPress={() => handleChatRoomPress(item.roomId, item.nickname, item.counselorName, item.roomStatus)}
      >
        <View style={styles.chatRoomContainer}>
          {/* 프로필 아이콘 */}
          <Icon name="person" size={40} color="#215D9A" marginRight={10}style={styles.userIcon} />
          <View style={styles.infoContainer}>
            <Text style={styles.memberName}>{item.nickname} 회원</Text>
            {/* 메시지가 null일 경우 빈 문자열로 처리 */}
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.messagePreview}>
              {item.message ? (item.message.length > 5 ? item.message.substring(0, 25) + '...' : item.message) : ''}
            </Text>
          </View>
          <View style={styles.rightContainer}>
            <View style={[styles.statusBadge, { backgroundColor: statusBackgroundColor }]}>
              <Text style={styles.statusText}>{statusText}</Text>
            </View>
            <Text style={styles.createdAt}>{displayText}</Text>
            {/* Open/Closed 상태 뱃지 */}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {chatRooms.length === 0 ? (
        <EmptyScreen message="채팅 내역이 없습니다" />
      ) : (
        <FlatList
          data={chatRooms}
          keyExtractor={(item) => item.roomId.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
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
    margintop: 50,
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15, 
    marginBottom:10,
    minWidth: 60, // 뱃지 최소 너비 설정
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CounselorChattingScreen;
