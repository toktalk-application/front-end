import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 더미 데이터
const chatRooms = [
  {
    roomId: 1,
    counselorId: 1,
    memberNickname: "남나미",
    createdAt: "2024-10-06T20:00:00+09:00", // KST
  },
  {
    roomId: 2,
    counselorId: 1,
    memberNickname: "슈파노바",
    createdAt: "2024-10-05T14:00:00+09:00", // KST
  },
  {
    roomId: 3,
    counselorId: 1,
    memberNickname: "눈누난나",
    createdAt: "2024-10-04T17:00:00+09:00", // KST
  },
];

function CounselorChattingScreen() {

  const navigation = useNavigation();
  const handleChatRoomPress = (roomId, memberNickname) => {
    console.log(`Entering chat room with ID: ${roomId}`);
    navigation.navigate('ChatRoom', { roomId, memberNickname });
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
        onPress={() => handleChatRoomPress(item.roomId, item.memberNickname)}
      >
        <View style={styles.row}>
          <Text style={styles.memberName}>{item.memberNickname} 내담자</Text>
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

export default CounselorChattingScreen;
