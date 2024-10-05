import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

function PricingSettingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.chargeContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>채팅 상담 가격 설정</Text>
          <Text style={styles.subtitle}>(50분 기준)</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="가격을 입력해주세요"
            keyboardType="numeric"
          />
          <Text style={styles.currency}>원</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>변경</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 추가적인 가격 설정을 위한 또 다른 chargeContainer */}
      <View style={styles.chargeContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>전화 상담 가격 설정</Text>
          <Text style={styles.subtitle}>(50분 기준)</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="가격을 입력해주세요"
            keyboardType="numeric"
          />
          <Text style={styles.currency}>원</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>변경</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // 배경 색상
    padding: 20,
  },
  chargeContainer: {
    backgroundColor: '#CCD2D9',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20, // 각 컨테이너 사이의 간격
    elevation: 5, // 안드로이드 그림자 효과
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 13,
    color: 'gray',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ccc',
  },
  input: {
    flex: 1,
    padding: 5,
    fontSize: 13,
    borderWidth: 1,
    backgroundColor:'white',
    borderColor: 'white',
    borderRadius: 5,
    marginRight: 10,
  },
  currency: {
    flex: 0.6,
    fontSize: 16,
    color: 'black',
  },
  button: {
    backgroundColor: '#001F3F', // 버튼 배경 색상
    paddingVertical: 5,
    paddingHorizontal:10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    color:'white',
    fontWeight: 'bold',
  },
});

export default PricingSettingScreen;
