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
          <Text style={styles.timeButtonText}>{time}</Text>
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
    backgroundColor: '#215D9A', // 기본 버튼 색상
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
  unavailableButton: {
    backgroundColor: '#bbbbbb',
  },
});

export default TimeSelection;
