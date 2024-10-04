import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import angleRightIcon from '../../assets/images/angleRight.png'

const MenuItem = ({ icon, title, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={icon} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Image source={angleRightIcon} style={styles.arrow} /> 
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // 좌우 배치
    alignItems: 'center', // 수직 중앙 정렬
    padding: 10, // 패딩 추가
    borderBottomWidth: 1, // 아래쪽 테두리 추가
    borderBottomColor: '#ccc', // 테두리 색상
    marginBottom:10
  },
  image: {
    width: 20,
    height: 20,
    marginRight: 10, // 이미지와 텍스트 사이의 간격
  },
  title: {
    flex: 1, // 텍스트가 가능한 공간을 차지하도록 설정
    fontSize: 16,
    fontWeight: '600',
  },
  arrow: {
    width: 20,
    height: 20,
  },
});

export default MenuItem;
