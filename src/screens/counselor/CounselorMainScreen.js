import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import CounselorCalendar from '../../components/Calendar/CounselorCalendar';
import { useNavigation } from '@react-navigation/native';
import sendGetRequest from '../../axios/SendGetRequest';
import { useAuth } from '../../auth/AuthContext';

function CounselorMainScreen() {
  const { state } = useAuth();
  const navigation = useNavigation();
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


  const handleReservationPress = (reservationId) => {
    navigation.navigate('CounselDetail', { reservationId });
  };

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 두 자리로 맞추기 위해 padStart 사용

    const formattedMonth = `${year}-${month}`;

    sendGetRequest({
      token: state.token,
      endPoint: "/reservations",
      requestParams: {
        counselorId: state.identifier,
        month: formattedMonth,
      },
      onSuccess: (data) => {
        /* console.log(data); */
        const filteredData = Object.keys(data.data).reduce((acc, key) => {
          if (data.data[key] === true) {  // 값이 true인 경우만
            acc[key] = data.data[key];    // 결과 객체에 추가
          }
          return acc;
        }, {});
        /* console.log(filteredData); */
        setMarkedDates(filteredData);
      },
      onFailure: () => Alert.alert("실패", "월별 일정 조회 실패")
    })
  }, []);

  const fetchReservations = async (date) => {
    const dummyReservations = [
      {
        reservationId: 5,
        counselorId: 1,
        nickName: "눈누난나",
        comment: "지친다 정말루다가",
        type: "CHAT",
        status: "PENDING",
        date: "2024-10-18",
        startTime: "09:00",
        endTime: "10:50",
      },
      {
        reservationId: 6,
        counselorId: 1,
        nickName: "김철수",
        comment: "우울해요",
        type: "CALL",
        status: "PENDING",
        date: "2024-10-18",
        startTime: "11:00",
        endTime: "11:50",
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
        </View>
      )}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handleReservationPress(item.reservationId)} style={styles.itemContainer}>
          <View style={styles.row}>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}> {formatTime(item.startTime)} </Text>
              <Text style={styles.timeText}> | </Text>
              <Text style={styles.timeText}> {formatTime(item.endTime)} </Text>
            </View>
            <View style={styles.detailsContainer}>
              <View style={styles.detailsRow}>
                <Text style={styles.nickNameText}>내담자 {item.nickName}</Text>
                <Text style={styles.typeText}> {item.type} </Text>
              </View>
              <Text style={styles.commentText}>상담 내용: {item.comment}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    marginLeft: 10,
    marginRight: 20,
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
    padding: 5,
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
    paddingVertical: 3,
    borderRadius: 10,
  },
  detailsRow: {
    flexDirection: 'row', // 좌우 배치
    justifyContent: 'space-between', // 양쪽 끝 정렬
    marginTop: 5,
    marginLeft: 5,
    marginRight: 10
  },
  nickNameText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  typeText: {
    color: 'black',
    fontSize: 11,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 5
  },
  commentText: {
    color: 'white',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 10,
    fontSize: 12,
  },
});


export default CounselorMainScreen;
