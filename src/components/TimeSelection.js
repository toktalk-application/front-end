import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TimeSelection = ({ availability, availableTimes, onTimePress }) => {

  const getStyle = (time) => {
    if(availableTimes[time]){
      return availability[time] && styles.selectedButton;
    }else{
      return styles.unavailableButton;
    }
  }

  const getTextStyle = (time) => {
    if (availableTimes[time]) {
      return availability[time] ? styles.selectedText : styles.timeButtonText; // 선택된 경우 흰색, 기본은 검은색
    } else {
      return styles.disabledText; // 비활성화된 경우 회색
    }
  };

  const isDisabled = (time) => {
    return !availableTimes[time];
  }
  return (
    <View style={styles.timeGrid}>
      {Object.keys(availability).map((time) => (
        <TouchableOpacity
          key={time}
          style={[styles.timeButton, getStyle(time)]}
          onPress={() => onTimePress(time)} // 선택된 시간 전달
          disabled = {isDisabled(time)}
        >
          <Text style={getTextStyle(time)}>{time}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  timeButton: {
    backgroundColor: 'lightgray', // 기본 버튼 색상
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
  selectedText:{
    color: 'white', // 텍스트 색상
    fontSize: 12,
    fontWeight: 'bold',
  },
  disabledText:{
    color: 'lightgray', // 텍스트 색상
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectedButton: {
    backgroundColor: '#215D9A',
  },
  unavailableButton: {
    backgroundColor: 'white',
  },
});

export default TimeSelection;