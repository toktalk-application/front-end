import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CustomDayComponent = ({ date, isDisabled, isToday, isSelected, isMarked, onDayPress }) => {
  const dayOfWeek = new Date(date.dateString).getDay(); // 요일 가져오기

  // 요일에 따라 색상 설정
  let textColor = isDisabled ? 'lightgray' : 'gray'; // 비활성 날짜는 밝은 회색
  let backgroundColor = 'transparent'; // 기본 배경 색상

  if (isSelected) {
    backgroundColor = '#001932'; // 선택된 날짜 배경색
    textColor = 'white'; // 선택된 날짜 텍스트 색상
  } else if (isToday) {
    textColor = '#67A0CA'; 
  } else if (!isDisabled) {
    if (dayOfWeek === 0) { // 일요일
      textColor = '#CA6767';
    } else if (dayOfWeek === 6) { // 토요일
      textColor = '#3C6894';
    }
  }

  return (
    <TouchableOpacity
      onPress={() => !isDisabled && onDayPress(date)}
      disabled={isDisabled}
      style={{ 
        paddingBottom: 5, 
        paddingTop: 5,
        paddingHorizontal: 8, 
        borderRadius: 5,
        alignItems: 'center', // 수평 중앙 정렬
        height:45
      }} // 배경 색상 및 패딩
    >
      {/* 날짜와 점을 감싸는 View */}
      <View style={{ 
        alignItems: 'center', // 수평 중앙 정렬
        justifyContent: 'center',
        }}>
        {/* 날짜 텍스트의 배경색을 위한 View */}
        <View style={{ 
          backgroundColor: isSelected ? '#001932' : 'transparent', // 선택된 날짜일 경우 배경색 설정
          borderRadius: 5,
          marginBottom: 2, // 점과의 간격 설정
          alignItems: 'center', // 수평 중앙 정렬
          justifyContent: 'center', // 수직 중앙 정렬
          width:25,
          height:25
        }}>
          <Text style={{ color: textColor, marginLeft:2.5, fontSize: 15, fontWeight: isToday ? 'bold' : 'normal' }}>
            {new Date(date.dateString).getDate()} {/* 날짜를 정수로 변환하여 표시 */}
          </Text>
        </View>
        {/* 점 표시 영역 */}
        {isMarked && (
          <View style={{
            backgroundColor: '#66798C', 
            width: 6, 
            height: 6, 
            borderRadius: 3, 
            marginTop: 2, // 날짜와 점 간의 간격 조정
          }} /> // 점 표시
        )}
      </View>
    </TouchableOpacity>

  );
};

const CounselorCalendar = ({ markedDates, onDayPress, selectedDate, minDate, maxDate }) => {
  const [isLoading, setIsLoading] = useState(true);

  console.log("markedDates in CounselorCalendar: ", markedDates);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <Calendar
      current={selectedDate || new Date().toISOString().split('T')[0]}
      minDate={minDate}
      maxDate={maxDate}
      dayComponent={({ date }) => {
        const isDisabled = new Date(date.dateString) < new Date(minDate) || new Date(date.dateString) > new Date(maxDate);
        const isToday = date.dateString === new Date().toISOString().split('T')[0]; // 오늘 날짜 확인
        const isSelected = date.dateString === selectedDate; // 선택된 날짜 확인
        const isMarked = markedDates[date.dateString]; // 마킹된 날짜 확인

        return (
          <CustomDayComponent
            date={date}
            isDisabled={isDisabled}
            isToday={isToday}
            isSelected={isSelected}
            isMarked={isMarked} // 마킹 여부 전달
            onDayPress={onDayPress}
          />
        );
      }}
      theme={{
        arrowColor: '#66798C',
        monthTextColor: 'black',
        textMonthFontWeight: 'bold',
        todayTextColor: '#5E9EDE',
        selectedDayBackgroundColor: 'green',
        selectedDayTextColor: 'white',
        dayTextColor: 'gray',
        textDisabledColor: 'lightgray',
        textSectionTitleColor: '#001326',
      }}
      style={{
        margin: 20, // 마진 조정
        padding: 0, // 패딩 조정
        backgroundColor: 'white', // 배경 색상
        borderRadius: 10, // 둥근 테두리
        elevation: 5, // Android 그림자
      }}
    />
  );
};

export default CounselorCalendar;
