import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CounselorCalendar from '../../components/Calendar/CounselorCalendar';

function CounselorMainScreen() {
  const [markedDates, setMarkedDates] = useState({});
  const [reservations, setReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // 화면이 포커스될 때마다 selectedDate와 reservations 초기화
  //     setSelectedDate('');
  //     setReservations([]); // 예약 목록도 비웁니다.
  //   }, [])
  // );

  useEffect(() => {
    const fetchMarkedDates = async () => {
      const dummyData = {
        "2024-10-01": null,
        "2024-10-02": null,
        "2024-10-03": false,
        "2024-10-04": true,
        "2024-10-05": true,
        "2024-10-06": true,
        "2024-10-07": false,
        "2024-10-08": false,
        "2024-10-18": true,
        "2024-10-30": false,
        "2024-10-31": true,
      };

      const formattedData = Object.keys(dummyData).reduce((acc, date) => {
        acc[date] = { marked: dummyData[date] === true };
        return acc;
      }, {});

      setMarkedDates(formattedData);
    };

    fetchMarkedDates();
  }, []);

  const fetchReservations = async (date) => {
    const dummyReservations = [
      {
        reservationId: 1,
        counselorId: 1,
        nickName: "홍길동",
        comment: "힘들어요 속상해요",
        type: "CHAT",
        status: "PENDING",
        date: "2024-10-18",
        startTime: "09:00",
        endTime: "10:50",
      },
      {
        reservationId: 2,
        counselorId: 1,
        nickName: "김철수",
        comment: "우울해요",
        type: "CALL",
        status: "CONFIRMED",
        date: "2024-10-18",
        startTime: "11:00",
        endTime: "12:00",
      },
    ];

    const filteredReservations = dummyReservations.filter(reservation => reservation.date === date);
    setReservations(filteredReservations);
  };

  const handleDayPress = (day) => {
    if (selectedDate === day.dateString) {
      // 이미 선택된 날짜를 다시 선택하면 선택 취소
      setSelectedDate('');
      setReservations([]); // 선택 취소 시 예약 목록도 초기화
    } else {
      // 새로운 날짜를 선택했을 때
      setSelectedDate(day.dateString);
      fetchReservations(day.dateString);
    }
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const formattedHour = (hour % 12 === 0 ? 12 : hour % 12).toString().padStart(2, '0'); // 0시를 12로 변환하고 2자리로 맞춤
    const period = hour < 12 ? '오전' : '오후';
    return `${period} ${formattedHour}:${minute}`;
  };

  return (
    <FlatList
      data={reservations}
      keyExtractor={(item) => item.reservationId.toString()}
      style={{ backgroundColor: 'white' }} // 여기에서 배경색을 흰색으로 설정
      ListHeaderComponent={() => (
        <View>
          <CounselorCalendar markedDates={markedDates} onDayPress={handleDayPress} selectedDate={selectedDate} />
          <Text>선택된 날짜: {selectedDate}</Text>
        </View>
      )}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
          <View style={styles.row}>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}> {formatTime(item.startTime)} </Text> 
              <Text style={styles.timeText}> | </Text>  
              <Text style={styles.timeText}> {formatTime(item.endTime)} </Text>
            </View>
            <View style={styles.detailsContainer}>
              <View style={styles.detailsRow}>
                <Text style={styles.nickNameText}>내담자        {item.nickName}</Text>
                <Text style={styles.typeText}>  {item.type}  </Text>
              </View>
              <Text style={styles.commentText}>상담 내용    {item.comment}</Text>
            </View>
          </View>
        </View>
        )}
    />
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    marginLeft:10,
    marginRight:20,
    padding: 5,
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row', // 좌우 배치
    justifyContent: 'space-between', // 양쪽 끝 정렬
    alignItems: 'center', // 수직 중앙 정렬
  },
  timeContainer: {
    flex: 2, // 공간을 차지하도록 설정
    padding:5,
    alignItems: 'center', // 왼쪽 정렬
    flexDirection: 'colum',
  },
  timeText: {
    color: 'black', // 시간 텍스트 색상
    fontSize: 12,
  },
  detailsContainer: {
    backgroundColor: '#001932', // 배경 색상
    flex: 7, // 공간을 더 차지하도록 설정
    paddingLeft: 10, // 약간의 여백
    borderRadius: 10,
  },
  detailsRow: {
    flexDirection: 'row', // 좌우 배치
    justifyContent: 'space-between', // 양쪽 끝 정렬
    marginTop:5,
    marginLeft:5,
    marginRight:10
  },
  nickNameText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  typeText: {
    color: 'black',
    fontSize: 11,
    backgroundColor:'white',
    borderRadius: 10,
  },
  commentText: {
    color: 'white',
    marginLeft:5,
    marginRight:5,
    marginTop:5,
    marginBottom:10,
    fontSize: 12,
  },
});


export default CounselorMainScreen;
