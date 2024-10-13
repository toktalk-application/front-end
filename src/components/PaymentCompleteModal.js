import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

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
          <Text style={styles.modalTitle}>예약 완료</Text>
          <Text style={styles.modalText}>예약이 성공적으로 완료되었습니다.</Text>
          <Text style={styles.infoText}>예약 번호: {paymentInfo.reservationNumber}</Text>
          <Text style={styles.infoText}>상담사: {paymentInfo.counselorName}</Text>
          <Text style={styles.infoText}>상담 유형: {paymentInfo.counselingType}</Text>
          <Text style={styles.infoText}>날짜: {paymentInfo.selectedDate}</Text>
          <Text style={styles.infoText}>시간: {paymentInfo.selectedTime}</Text>
          <Text style={styles.infoText}>금액: {paymentInfo.amount}</Text>
          <Text style={styles.infoText}>결제 방법: {paymentInfo.paymentMethod}</Text>
          <Text style={styles.noteText}>환불 및 취소는 상담 24시간 전까지 가능합니다.</Text>
          <Text style={styles.noteText}>상담 전 준비사항은 예약 확인 이메일을 확인해 주세요.</Text>
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
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  infoText: {
    marginBottom: 5,
  },
  noteText: {
    marginTop: 10,
    fontStyle: 'italic',
  },
  contactText: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PaymentCompleteModal;