import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

function CounselorTimeSettingScreen() {
  const [selectedDay, setSelectedDay] = useState('일'); // 현재 선택된 요일
  const [availability, setAvailability] = useState({
    '일': {
      '9:00': false, '10:00': false,'11:00': false, '12:00': false, '13:00': false, '14:00': false, '15:00': false, 
      '16:00': false,'17:00': false, '18:00': false, '19:00': false,'20:00': false, '21:00': false, '22:00': false, '23:00': false,
    },
    '월': {
      '9:00': false, '10:00': false,'11:00': false, '12:00': false, '13:00': false, '14:00': false, '15:00': false, 
      '16:00': false,'17:00': false, '18:00': false, '19:00': false,'20:00': false, '21:00': false, '22:00': false, '23:00': false,
    },
    '화': {
      '9:00': false, '10:00': false,'11:00': false, '12:00': false, '13:00': false, '14:00': false, '15:00': false, 
      '16:00': false,'17:00': false, '18:00': false, '19:00': false,'20:00': false, '21:00': false, '22:00': false, '23:00': false,
    },
    '수': {
      '9:00': false, '10:00': false,'11:00': false, '12:00': false, '13:00': false, '14:00': false, '15:00': false, 
      '16:00': false,'17:00': false, '18:00': false, '19:00': false,'20:00': false, '21:00': false, '22:00': false, '23:00': false,
    },
    '목': {
      '9:00': false, '10:00': false,'11:00': false, '12:00': false, '13:00': false, '14:00': false, '15:00': false, 
      '16:00': false,'17:00': false, '18:00': false, '19:00': false,'20:00': false, '21:00': false, '22:00': false, '23:00': false,
    },
    '금': {
      '9:00': false, '10:00': false,'11:00': false, '12:00': false, '13:00': false, '14:00': false, '15:00': false, 
      '16:00': false,'17:00': false, '18:00': false, '19:00': false,'20:00': false, '21:00': false, '22:00': false, '23:00': false,
    },
    '토': {
      '9:00': false, '10:00': false,'11:00': false, '12:00': false, '13:00': false, '14:00': false, '15:00': false, 
      '16:00': false,'17:00': false, '18:00': false, '19:00': false,'20:00': false, '21:00': false, '22:00': false, '23:00': false,
    },
  });

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
  
    // 여기에 POST 요청 코드를 추가할 수 있습니다.
    // 예: await axios.post('YOUR_API_ENDPOINT', dataToSend); 
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
        {Object.keys(availability[selectedDay]).map((time) => (
          <TouchableOpacity
            key={time}
            style={[styles.timeButton, availability[selectedDay][time] && styles.selectedButton]}
            onPress={() => handleTimePress(time)}
          >
            <Text style={styles.buttonText}>{time}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.notice}>변경 시,</Text>
      <Text style={styles.notice}>현재 날짜 이후의 모든 예약 가능한 시간이 업데이트 됩니다.</Text>
        <View style={styles.buttonContainer}>
            <Button title="변경 완료" onPress={handleComplete} color="#001932" />
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
    marginTop: 10, // 원하는 여백 추가
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
});

export default CounselorTimeSettingScreen;
