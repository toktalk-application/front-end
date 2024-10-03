import React from 'react';
import { Calendar } from 'react-native-calendars';

const MemberCalendar = () => {
  return (
    <Calendar
      // 초기 날짜 설정
      current={new Date().toISOString().split('T')[0]}
      // 날짜 선택 시 호출되는 함수
      onDayPress={(day) => {
        console.log('선택한 날짜:', day);
      }}
      // 표시 형식 설정
      markedDates={{
        '2024-10-10': { marked: true, dotColor: 'red' },
      }}
    />
  );
};

export default MemberCalendar;
