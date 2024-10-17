import React, { useState, useEffect, useCallback,useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import CounselorCalendar from '../../components/Calendar/CounselorCalendar';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import sendGetRequest from '../../axios/SendGetRequest';
import { useAuth } from '../../auth/AuthContext';

function CounselorMainScreen() {
  const { state } = useAuth();
  const navigation = useNavigation();
  const [markedDates, setMarkedDates] = useState({});
  const [reservations, setReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const flatListRef = useRef(null);

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

  useFocusEffect(
    useCallback(() => {
      //setSelectedDate('');
      const today = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
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
          /* console.log("marked data: ", data); */
          const filteredData = Object.keys(data.data).reduce((acc, key) => {
            if (data.data[key] === true) {  // 값이 true인 경우만
              acc[key] = data.data[key];    // 결과 객체에 추가
            }
            return acc;
          }, {});
          console.log("filtered data: ", filteredData);
          setMarkedDates(filteredData);
        },
        /* onFailure: () => Alert.alert("요청 실패", "월별 일정 조회 실패"), */
      });
    }, [])
  );

  const fetchReservations = async (date) => {
    sendGetRequest({
      token: state.token,
      endPoint: "/reservations",
      requestParams: {
        counselorId: state.identifier,
        date: date,
      },
      onSuccess: (data) => {
        console.log("data: ", data);
        setReservations(data.data);
      },
      onFailure: (status, message) => {
        if(message.includes("Given")) {
          Alert.alert("요청 실패", "기본 상담 시간을 설정해주세요");
          return;
        }
        Alert.alert("실패", "내 특정일 상담 목록 조회 실패")
      },
      disableDefaultAlert: true,
    });
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
  
  useEffect(() => {
    if (flatListRef.current) {
        flatListRef.current.scrollToEnd({
            y: flatListRef.current.scrollHeight,
            animated: true, // 부드럽게 스크롤
          });
        // 데이터가 변경될 때마다 FlatList의 끝으로 스크롤
    }
}, [selectedDate, reservations]);

  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const formattedHour = (hour % 12 === 0 ? 12 : hour % 12).toString().padStart(2, '0'); // 0시를 12로 변환하고 2자리로 맞춤
    const period = hour < 12 ? '오전' : '오후';
    return `${period} ${formattedHour}:${minute}`;
  };

  const getMinDate = () => {
    return new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString().split('T')[0];
  }

  const getMaxDate = () => {
    const today = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);

    const currentYear = today.getFullYear();
    const nextMonth = today.getMonth() + 1;

    // 다음 달의 마지막 날 계산
    const lastDayOfNextMonth = new Date(currentYear, nextMonth + 1, 0).getDate();

    // 최대 날짜 설정
    return (`${currentYear}-${String(nextMonth + 1).padStart(2, '0')}-${lastDayOfNextMonth}`);
  }

  return (
    <FlatList
      ref={flatListRef}
      data={reservations}
      keyExtractor={(item) => item.reservationId.toString()}
      style={{ backgroundColor: 'white' }} // 여기에서 배경색을 흰색으로 설정
      ListHeaderComponent={() => (
        <View>
          <CounselorCalendar markedDates={markedDates} onDayPress={handleDayPress} selectedDate={selectedDate} minDate={getMinDate()} maxDate={getMaxDate()} />
        </View>
      )}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handleReservationPress(item.reservationId)} style={styles.itemContainer}>
          {selectedDate === '' ? <View /> : <View style={styles.row}>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}> {formatTime(item.startTime)} </Text>
              <Text style={styles.timeText}> | </Text>
              <Text style={styles.timeText}> {formatTime(item.endTime)} </Text>
            </View>
            <View style={styles.detailsContainer}>
              <View style={styles.detailsRow}>
                <View style= {{ flexDirection: 'row', justifyContent: 'space-between', alignItems:'center', marginBottom:10}}>
                  <Text style={styles.nickNameText}>회원 </Text>
                  <Text style= {{color :'white'}}>{item.memberNickname}</Text>
                </View>
                <Text style={styles.typeText}> {item.type} </Text>
              </View>
              <View style= {{ flexDirection: 'row', justifyContent: 'flex-start', alignItems:'center'}}>
                <Text style={styles.commentText}> 상담 내용 </Text> 
                <Text style= {{ color: 'white', marginRight:70}}   numberOfLines={1} ellipsizeMode="tail" > {item.comment || '없음'}</Text>
              </View>
            </View>
          </View>}
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
    marginBottom:10
  },
  row: {
    flexDirection: 'row', // 좌우 배치
    justifyContent: 'space-between', // 양쪽 끝 정렬
    alignItems: 'center', // 수직 중앙 정렬
  },
  timeContainer: {
    flex: 2, // 공간을 차지하도록 설정
    padding: 3,
    alignItems: 'center', // 왼쪽 정렬
    flexDirection: 'colum',
  },
  timeText: {
    color: 'black', // 시간 텍스트 색상
    fontSize: 14,
  },
  detailsContainer: {
    backgroundColor: '#215D9A', // 배경 색상
    flex: 7, // 공간을 더 차지하도록 설정
    paddingLeft: 10, // 약간의 여백
    paddingVertical: 10,
    paddingBottom:15,
    borderRadius: 10,
  },
  detailsRow: {
    flexDirection: 'row', // 좌우 배치
    justifyContent: 'space-between', // 양쪽 끝 정렬    
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 10
  },
  nickNameText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  typeText: {
    color: 'black',
    fontSize: 13,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical:2,
    marginBottom:5
  },
  commentText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});


export default CounselorMainScreen;

