import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 더미 데이터
const chatRooms = [
  // counselor 이미지까지 있으면 좋을 듯. 
  // get/chatRooms 인데 authentication 전달해서 지금 로그인 한 사람의 채팅방 목록 데리고 오기.
  {
    roomId: 1,
    counselorId: 1,
    memberNickname: "냠냐미",
    counselorName: "김철수",
    createdAt: "2024-10-06T20:00:00+09:00", // KST
  },
  {
    roomId: 2,
    counselorId: 2,
    memberNickname: "냠냐미",
    counselorName: "안성진",
    createdAt: "2024-10-05T14:00:00+09:00", // KST
  },
  {
    roomId: 3,
    counselorId: 3,
    memberNickname: "냠냐미",
    counselorName: "백종원",
    createdAt: "2024-10-04T17:00:00+09:00", // KST
  },
];

function MemberChattingScreen() {
  const userType = 'member';

  const navigation = useNavigation();
  const handleChatRoomPress = (roomId, memberNickname, counselorName) => {
    console.log(`Entering chat room with ID: ${roomId}`);
    navigation.navigate('ChatRoom', { roomId, memberNickname, counselorName});
  };


  const renderItem = ({ item }) => {
    const createdDate = new Date(item.createdAt);
    const today = new Date();

    // 현재 날짜와 생성 날짜 비교
    const isToday = createdDate.toDateString() === today.toDateString();
    
    let displayText;
    if (isToday) {
      // 오늘이면 시간만 표시
      const options = { hour: 'numeric', minute: 'numeric', hour12: true };
      displayText = createdDate.toLocaleString('ko-KR', options); // 오늘이면 시간 포맷
    } else {
      // 오늘이 아니면 날짜만 표시
      const options = { month: 'long', day: 'numeric' };
      displayText = createdDate.toLocaleDateString('ko-KR', options).replace(/월/g, '월 ').replace(/일/g, '일'); // 날짜 포맷
    }

    return (
      <TouchableOpacity 
        style={styles.chatRoom} 
        onPress={() => handleChatRoomPress(item.roomId, item.memberNickname, item.counselorName )}
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
      <FlatList
        data={chatRooms}
        keyExtractor={(item) => item.roomId.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // 화면 전체를 차지하도록 설정
    backgroundColor: 'white', // 배경색을 하얗게 설정
  },
  listContainer: {
    padding: 10,
  },
  chatRoom: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom:5
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberName: {
    fontWeight: 'bold',
    fontSize:16
  },
  createdAt: {
    color: '#666',
  },
});

export default MemberChattingScreen;
