import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import sendGetRequest from '../../axios/SendGetRequest';
import { useAuth } from '../../auth/AuthContext';
import { useCallback } from 'react';
import EmptyScreen from '../EmptyScreen';
import LoadingScreen from '../LoadingScreen';

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
        console.log(chatRooms);
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
    return <LoadingScreen message ={'채팅 정보를 불러오는 중 입니다..'}/>;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>오류: {error}</Text>
      </View>
    );
  }


  const handleChatRoomPress = (roomId, nickname, counselorName) => {
    navigation.navigate('ChatRoom', { roomId, nickname, counselorName});
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

    // 상태에 따라 텍스트 배경색 결정
    const roomStatusBackgroundColor = item.roomStatus === 'open' ? '#3C6894' : 
                                       item.roomStatus === 'close' ? 'lightcoral' : 
                                       'transparent'; // 기본값 (기타 상태)
  
    return (
      <TouchableOpacity
        style={styles.chatRoom}
        onPress={() => handleChatRoomPress(item.roomId, item.nickname, item.counselorName)}
      >
        <View style={styles.chatRoomContainer}>
          <View style={styles.infoContainer}>
            <View style={styles.row}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.memberName}>{item.nickname} 내담자</Text>
                <Text style={[styles.roomStatus, { backgroundColor: roomStatusBackgroundColor }]}>
                  {item.roomStatus}
                </Text>
              </View>
              <Text style={styles.createdAt}>{displayText}</Text>
            </View>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {chatRooms.length === 0 ? <EmptyScreen message="채팅 내역이 없습니다"/> :<FlatList
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
  chatRoom: {
    borderBottomColor: '#ccc',
    marginBottom: 5,
  },
  chatRoomContainer:{
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
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width:'100%',
    alignItems: 'center',
  },
  memberName: {
    fontWeight: 'bold',
    fontSize: 18,
    width:180
  },
  createdAt: {
    color: '#666',
    fontSize:16,
  },
  message:{
    marginTop:5,
    marginLeft:0,
    fontSize:16
  },
  roomStatus:{
    width:60,
    justifyContent: 'space-between',
    textAlign:'center',
    borderRadius: 5,
    color:'white',
    fontSize:15,
    paddingVertical:3
  }
});

export default CounselorChattingScreen;
