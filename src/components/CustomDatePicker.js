// CustomDatePicker.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';

const CustomDatePicker = ({ birthDate, setBirthDate }) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setOpen(true)} style={styles.inputContainer}>
        <Text style={styles.placeholderText}>
          {birthDate.toISOString().split('T')[0] || '날짜 선택'}
        </Text>
      </TouchableOpacity>
      <DatePicker
        locale='ko-KR'
        modal
        open={open}
        date={birthDate}
        mode="date"
        onConfirm={(date) => {
          setOpen(false);
          setBirthDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'left',
    width:320,
    height:40
  },
  placeholderText: {
    fontSize: 16, // 글씨 크기
    textAlign: 'left', // 가운데 정렬
    color: '#999', // placeholder 색상
    marginLeft:10,
    lineHeight: 35, 
  },
});

export default CustomDatePicker;