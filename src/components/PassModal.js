import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import sendPostRequest from '../axios/SendPostRequest';

const PassModal = ({ visible, onClose, name, phoneNumber, carrier, residentNumber1, residentNumber2 }) => {
    const handleComplete = () => {
        const fullResidentNumber = residentNumber1 + residentNumber2;

        const queryParams = new URLSearchParams({
            name: name,
            phoneNo: phoneNumber,
            identity: fullResidentNumber,
            telecom: carrier
        }).toString();

        sendPostRequest({
            endPoint: `/identity/add-verify?${queryParams}`,
            onSuccess: () => {
                Alert.alert("완료", "인증이 성공적으로 완료되었습니다.");
                onClose(); // 모달 닫기
            },
            onFailure: () => {
                /* Alert.alert("오류", "인증에 실패했습니다. 다시 시도해주세요.") */
                onClose(); // 모달 닫기
            }
        });
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>PASS 인증 후 완료 버튼을 눌러주세요.</Text>
                    </View>
                    <TouchableOpacity style={styles.successButton} onPress={handleComplete}>
                        <Text style={styles.successButtonText}> 완료 </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    successButton: {
        backgroundColor: '#001F3F', // 버튼 색상
        marginTop:30,
        padding: 10,
        borderRadius: 5,
    },
    successButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default PassModal;
