import React, { useEffect, useState } from 'react';
import { Alert, View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import sendGetRequest from '../../axios/SendGetRequest';
import { useAuth } from '../../auth/AuthContext';
import sendPatchRequest from '../../axios/PatchRequest';
import sendPostRequest from '../../axios/SendPostRequest';

function CounselorTimeSettingScreen({ route, navigation }) {
  const { state } = useAuth();
  const { defaultDayInitialized } = route.params;
  const [selectedDay, setSelectedDay] = useState('일'); // 현재 선택된 요일
  const [isLoading, setIsLoading] = useState(true);
  const [availability, setAvailability] = useState({
    '일': {
      '09:00': false, '10:00': false,'11:00': false, '12:00': false, '13:00': false, '14:00': false, '15:00': false, 
      '16:00': false,'17:00': false, '18:00': false, '19:00': false,'20:00': false, '21:00': false, '22:00': false, '23:00': false,
    },
    '월': {
      '09:00': false, '10:00': false,'11:00': false, '12:00': false, '13:00': false, '14:00': false, '15:00': false, 
      '16:00': false,'17:00': false, '18:00': false, '19:00': false,'20:00': false, '21:00': false, '22:00': false, '23:00': false,
    },
    '화': {
      '09:00': false, '10:00': false,'11:00': false, '12:00': false, '13:00': false, '14:00': false, '15:00': false, 
      '16:00': false,'17:00': false, '18:00': false, '19:00': false,'20:00': false, '21:00': false, '22:00': false, '23:00': false,
    },
    '수': {
      '09:00': false, '10:00': false,'11:00': false, '12:00': false, '13:00': false, '14:00': false, '15:00': false, 
      '16:00': false,'17:00': false, '18:00': false, '19:00': false,'20:00': false, '21:00': false, '22:00': false, '23:00': false,
    },
    '목': {
      '09:00': false, '10:00': false,'11:00': false, '12:00': false, '13:00': false, '14:00': false, '15:00': false, 
      '16:00': false,'17:00': false, '18:00': false, '19:00': false,'20:00': false, '21:00': false, '22:00': false, '23:00': false,
    },
    '금': {
      '09:00': false, '10:00': false,'11:00': false, '12:00': false, '13:00': false, '14:00': false, '15:00': false, 
      '16:00': false,'17:00': false, '18:00': false, '19:00': false,'20:00': false, '21:00': false, '22:00': false, '23:00': false,
    },
    '토': {
      '09:00': false, '10:00': false,'11:00': false, '12:00': false, '13:00': false, '14:00': false, '15:00': false, 
      '16:00': false,'17:00': false, '18:00': false, '19:00': false,'20:00': false, '21:00': false, '22:00': false, '23:00': false,
    },
  });

  useEffect(() => {
    getDefaultTimes(korDayToEng(selectedDay));
  },[selectedDay]);

  const engDayToKor = (dayOfWeek) => {
    switch(dayOfWeek){
      case "SUNDAY": return '일';
      case "MONDAY": return '월';
      case "TUESDAY": return '화';
      case "WEDNESDAY": return '수';
      case "THURSDAY": return '목';
      case "FRIDAY": return '금';
      case "SATURDAY": return '토';
    }
  }

  const korDayToEng = (dayOfWeek) => {
    switch(dayOfWeek){
      case "일": return "SUNDAY";
      case "월": return "MONDAY";
      case "화": return "TUESDAY";
      case "수": return "WEDNESDAY";
      case "목": return "THURSDAY";
      case "금": return "FRIDAY";
      case "토": return "SATURDAY";
    }
  }

  const korDayAdd = (dayOfWeek) => {
    switch(dayOfWeek){
      case "일": return "일요일";
      case "월": return "월요일";
      case "화": return "화요일";
      case "수": return "수요일";
      case "목": return "목요일";
      case "금": return "금요일";
      case "토": return "토요일";
    }
  }

  const getDefaultTimes = (dayOfWeek) => {
    sendGetRequest({
      token: state.token,
      endPoint: "/counselors/default-days",
      requestParams: {
        dayOfWeek: dayOfWeek,
      },
      onSuccess: (data) => {
        console.log("initial data: ", data);
        let newAvailability = availability;
        let dayKey = engDayToKor(dayOfWeek);
        
        data.data.forEach(time => {
          newAvailability[dayKey][time] = true;
        });
        console.log("newAvailability: ", newAvailability[engDayToKor(dayOfWeek)]);
        setAvailability(newAvailability);
        setIsLoading(false);
      },
      /* onFailure: () => Alert.alert("실패", "내 기본 상담 시간 조회 실패") */
    });
  }

  const handleTimePress = (time) => {
    setAvailability((prevAvailability) => ({
      ...prevAvailability,
      [selectedDay]: {
        ...prevAvailability[selectedDay],
        [time]: !prevAvailability[selectedDay][time], // 현재 상태를 반전시킴
      },
    }));
  };

  const handleComplete = () => {
    const availableTimes = Object.keys(availability[selectedDay]).filter(time => availability[selectedDay][time]);
    
    // 선택된 요일에 해당하는 예약 가능 시간만 담기
    const dataToSend = {
      [selectedDay]: availableTimes,
    };
  
    // 각 요일에 해당하는 배열을 콘솔에 출력
    console.log('예약 가능 시간:', dataToSend);
  
    if(defaultDayInitialized){
      // 기본 상담 시간 수정
      sendPatchRequest({
        token: state.token,
        endPoint: "/counselors/default-days",
        requestBody: {
          dayOfWeek: korDayToEng(selectedDay),
          times: availableTimes,
        },
        onSuccess: () => Alert.alert("성공", `${korDayAdd(selectedDay)} 기본 상담 시간 수정 완료`),
        /* onFailure: () => Alert.alert("실패", "기본 상담 시간 수정 실패!") */
      });
    }else{ // 기본 상담 시간 최초 등록
      console.log("기본 상담 시간 최초 등록");
      sendPostRequest({
        token: state.token,
        endPoint: "/counselors/default-days",
        requestBody: {
          dayOfWeek: korDayToEng(selectedDay),
          times: availableTimes,
        },
        onSuccess: () => Alert.alert("성공", `${korDayAdd(selectedDay)} 기본 상담 시간 등록 완료`),
        /* onFailure: () => Alert.alert("실패", "기본 상담 시간 등록 실패!") */
      });
    }
  };
  

  const days = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {days.map((day) => (
          <TouchableOpacity
            key={day}
            style={[styles.tabButton, selectedDay === day && styles.activeTab]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={styles.tabText}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.timeGrid}>
        {isLoading ? <View/> : Object.keys(availability[selectedDay]).map((time) => (
          <TouchableOpacity
            key={time}
            style={[styles.timeButton, availability[selectedDay][time] && styles.selectedButton]}
            onPress={() => handleTimePress(time)}
          >
            <Text style={styles.buttonText}>{time}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <View style={{marginBottom: 10}}>
          <Text style={styles.notice}>변경 시,</Text>
          <Text style={styles.notice}>현재 날짜 이후의 모든 예약 가능한 시간이 업데이트 됩니다.</Text>
        </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleComplete}>
                <Text style={styles.submitButtonText}>{korDayAdd(selectedDay)} 변경 </Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tabButton: {
    padding: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#001932', // 선택된 탭의 하단 테두리 색상
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
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
  selectedButton: {
    backgroundColor: '#00bcd4', // 선택된 버튼 색상
  },
  buttonContainer: {
    marginTop: 30, // 원하는 여백 추가
    marginBottom: 20, // 필요한 경우 아래쪽 여백 추가
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  notice: {
    textAlign: 'center',
    fontSize: 12,
    color: 'gray',
  },
  submitButton: {
    marginTop: 10,
    marginBottom: 40,
    padding: 10,
    backgroundColor: '#001326',
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
      fontSize: 17,
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
  },
});

export default CounselorTimeSettingScreen;
