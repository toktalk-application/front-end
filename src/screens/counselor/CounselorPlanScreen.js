import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import CounselorPlanCalendar from '../../components/Calendar/CounselorPlanCalendar';
import { useNavigation } from '@react-navigation/native';
import sendGetRequest from '../../axios/SendGetRequest';
import { useAuth } from '../../auth/AuthContext';
import sendPatchRequest from '../../axios/PatchRequest';

function CounselorPlanScreen() {
  const { state } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDay, setSelectedDay] = useState('일요일'); // 현재 선택된 요일
  const initialTimeslots = { '09:00': false, '10:00': false, '11:00': false, '12:00': false, '13:00': false, '14:00': false, '15:00': false, '16:00': false, '17:00': false, '18:00': false, '19:00': false, '20:00': false, '21:00': false, '22:00': false, '23:00': false };
  const [timeslots, setTimeslots] = useState(initialTimeslots);

  const navigation = useNavigation();


  // 기본 시간 설정 예시
  const defaultTimes = {
    '일요일': ['12:00', '13:00', '16:00', '17:00', '18:00', '20:00'],
    // 다른 요일의 기본 시간 추가 가능
  };

  useEffect(() => {
    if(!selectedDate) return;

    sendGetRequest({
      token: state.token,
      endPoint: "/counselors/available-dates",
      requestParams: {
        date: selectedDate
      },
      onSuccess: (data) => {
        console.log("data: ", data);
        let newTimeslots = initialTimeslots;
        Object.keys(data.data.availableTimes).forEach(time => {
          newTimeslots[time] = true;
        });
        console.log("newTimeslots: ", newTimeslots);
        setTimeslots(newTimeslots);
      },
      onFailure: () => Alert.alert("실패", "내 상담시간 조회 실패!")
    });
  }, [selectedDate]);

  const handleDayPress = (day) => {
    if (selectedDate === day.dateString) {
      // 이미 선택된 날짜를 다시 선택하면 선택 취소
      setSelectedDate('');
    } else {
      // 새로운 날짜를 선택했을 때
      setSelectedDate(day.dateString);
      const date = new Date(day.dateString);
      const dayOfWeek = date.toLocaleString('ko-KR', { weekday: 'long' }); // 요일 가져오기
      setSelectedDay(dayOfWeek); // 선택된 요일 상태 업데이트
      console.log('선택된 요일:', dayOfWeek); // 요일 출력

      // 기본 시간 설정
      /* if (defaultTimes[dayOfWeek]) {
        const updatedAvailability = { ...availability[dayOfWeek] };
        defaultTimes[dayOfWeek].forEach(time => {
          updatedAvailability[time] = true; // 해당 시간의 상태를 true로 설정
        });
        setAvailability((prev) => ({
          ...prev,
          [dayOfWeek]: updatedAvailability,
        }));
      } */
    }
  };

  const handleTimePress = (time) => {
    setTimeslots((prevAvailability) => ({
      ...prevAvailability,
      [time]: !timeslots[time],
    }));
  };
  const handleComplete = () => {
    if (!selectedDate) {
      console.log('날짜가 선택되지 않았습니다.');
      return;
    }

    const availableTimes = Object.keys(timeslots).filter(time => timeslots[time]);
    
    // 각 요일 및 날짜에 해당하는 배열을 콘솔에 출력
    console.log('예약 가능 시간:', availableTimes);

    // 여기에 POST 요청 코드를 추가할 수 있습니다.
    sendPatchRequest({
      token: state.token,
      endPoint: "/counselors/available-dates",
      requestBody: {
        date: selectedDate,
        times: availableTimes,
      },
      onSuccess: () => Alert.alert("요청 성공", "상담 시간 변경 완료"),
      onFailure: () => Alert.alert("요청 실패", "상담 시간 변경 실패"),
    })
  };



  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('기본 시간 설정')}>
          <Text style={styles.buttonText}>기본 시간 설정</Text>
        </TouchableOpacity>
      </View>
      <CounselorPlanCalendar onDayPress={handleDayPress} selectedDate={selectedDate} />
      <View style={styles.timeDetailContainer}>
        {!selectedDate ? <View/> : <View style={styles.timeGrid}>
          {Object.keys(timeslots).map((time) => (
            <TouchableOpacity
              key={time}
              style={[styles.timeButton, timeslots[time] && styles.selectedButton]}
              onPress={() => handleTimePress(time)}
            >
              <Text style={styles.timeButtonText}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>}
        <View style={styles.buttonContainer}>
          {selectedDate ? (
              <View style={{ marginBottom: 10 }}>
                  <Text style={styles.notice}>변경 시,</Text>
                  <Text style={styles.notice}>현재 날짜 이후의 모든 예약 가능한 시간이 업데이트 됩니다.</Text>
              </View>
          ) : null}

          {selectedDate ? (
                  <TouchableOpacity style={styles.submitButton} onPress={handleComplete}>
                      <Text style={styles.submitButtonText}>변경 완료</Text>
                  </TouchableOpacity>
              ) : null}
          </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // 오른쪽 정렬
    alignItems: 'center',
    marginTop: 10,
    marginRight: 15,
  },
  button: {
    backgroundColor: '#001932', // 버튼 배경 색상
    padding: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white', // 텍스트 색상
    fontSize: 12,
    fontWeight: 'bold',
  },
  timeDetailContainer: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeButton: {
    backgroundColor: '#e0f7fa', // 기본 버튼 색상
    padding: 10,
    margin: 5,
    borderRadius: 5,
    width: '30%', // 버튼 너비
    alignItems: 'center',
  },
  timeButtonText: {
    color: 'black', // 텍스트 색상
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectedButton: {
    backgroundColor: '#00bcd4',
  },
  notice: {
    textAlign: 'center',
    fontSize: 12,
    color: 'gray',
  },
  buttonContainer: {
    marginTop: 10, // 원하는 여백 추가
    marginBottom: 20, // 필요한 경우 아래쪽 여백 추가
  },
  submitButton: {
    marginBottom: 40,
    padding: 10,
    backgroundColor: '#001326',
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
  },
});

export default CounselorPlanScreen;
