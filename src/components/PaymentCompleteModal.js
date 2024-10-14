import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity,Image } from 'react-native';
import LottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable';

// 결제 성공 모달창
const PaymentCompleteModal = ({ visible, onClose, paymentInfo }) => {
  

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Image source={require('../../assets/images/check.png')} style={styles.icon} />
          <Text style={styles.infoTitle}>예약이 완료되었습니다.</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>No. {paymentInfo.reservationNumber}</Text>
            <View style={styles.contentSection}>
              <View style={styles.counselorInfo}>
                <Text style={styles.sectionTitle}>상담사</Text>
                <Text style={styles.counselorName}> {paymentInfo.counselorName}</Text>
              </View>
              <View style={styles.counselorInfo}>
                <Text style={styles.sectionTitle}>상담 유형</Text>
                <Text style={styles.counselingType}>{paymentInfo.counselingType}</Text>
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>일정</Text>
              <Text style={styles.date}>{paymentInfo.selectedDate}</Text>
              <Text style={styles.time}>{paymentInfo.selectedTime}</Text>
            </View>
          </View>
          <View style={styles.paymentContainer}>
            <Text style={styles.paymentTitle}>결제 금액</Text>
            <Text style={styles.totalAmount}>{paymentInfo.amount} 원 </Text>
          </View>
          <Text style={styles.noteText}>환불 및 취소는 상담 24시간 전까지 가능합니다.</Text>
          <Text style={styles.contactText}>문의: 1234-5678</Text>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom:20
  },
  infoTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 5,
    marginTop:30,
    borderWidth: 1,
    borderColor: '#333D4B',
    borderRadius: 10,
    padding:10
  },
  infoText: {
    fontSize:16,
    textDecorationLine: 'underline', 
  },
  contentSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 3,
    marginTop: 5,
  },
  counselorInfo: {
    flex: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  sectionTitle: {
    fontWeight: 'bold',
    alignItems: 'center',
  },
  counselorName: {
    alignItems: 'center',
  },
  counselingType: {
    marginLeft:5,
    marginBottom:1,
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
  },
  date: {
    marginLeft: 6,
    marginTop: 1,
    textAlign: 'center',
  },
  time: {
    marginTop: 1,
    marginLeft: 7,
    textAlign: 'center',
  },
  paymentContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '97%',
    marginBottom:20,
    marginTop:10
  },
  paymentTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    marginTop: 5,
  },
  totalAmount: {
    fontSize: 23,
    fontWeight: 'bold',
    marginTop: 5,
  },
  noteText: {
    marginTop: 10,
    textAlign: 'center',
    fontSize:13
  },
  contactText: {
    marginTop: 2,
    fontWeight: 'bold',
    textAlign: 'left' 
  },
  button: {
    backgroundColor: '#001F3F', // 버튼 색상
    marginTop: 30,
    marginBottom: 5,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center', // 수직 중앙 정렬
    alignItems: 'center', // 수평 중앙 정렬
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center', // 텍스트 수평 중앙 정렬
    paddingHorizontal:50
  },
});

export default PaymentCompleteModal;
