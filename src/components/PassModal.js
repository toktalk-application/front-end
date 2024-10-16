import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import sendPostRequest from '../axios/SendPostRequest';
import { REACT_APP_API_URL } from '@env';
import axios from 'axios';

const PassModal = ({ visible, onClose, onSuccess, name, phoneNumber, carrier, residentNumber1, residentNumber2 }) => {
    const handleComplete = () => {
        const fullResidentNumber = residentNumber1 + residentNumber2;

        const queryParams = new URLSearchParams({
            name: name,
            phoneNo: phoneNumber,
            identity: fullResidentNumber,
            telecom: carrier
        }).toString();

        const params = {
            name: name,
            phoneNo: phoneNumber,
            identity: fullResidentNumber,
            telecom: carrier,
        }

        // sendPostRequest({
        //     endPoint: `/identity/add-verify?${queryParams}`,
        //     onSuccess: () => {
        //         Alert.alert("완료", "인증이 성공적으로 완료되었습니다.");
        //         onClose(); // 모달 닫기
        //     },
        //     onFailure: () => {
        //         /* Alert.alert("오류", "인증에 실패했습니다. 다시 시도해주세요.") */
        //         onClose(); // 모달 닫기
        //     }
        // });

        handlePassVerification(params);
    };

    const handlePassVerification = async (params) => {
        try {
            console.log("REACT_APP_API_URL :", REACT_APP_API_URL);
            console.log("queryParams: ", params);
            const response = await axios.post(
                `${REACT_APP_API_URL}/identity/add-verify`,
                null,
                {
                    params: params,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            // response.data.response가 JSON 문자열이므로 파싱해야 함
            const parsedResponse = JSON.parse(response.data.response);

            console.log("response: ", parsedResponse);
            console.log("Code: ", parsedResponse.result.code); // result의 code에 접근  
            const code = parsedResponse.result.code;

            switch (code) {
                case "CF-00000":
                    Alert.alert('인증 성공', "인증이 완료되었습니다.");
                    onSuccess();
                    break;
                case "CF-00025":
                    Alert.alert('인증 성공', "인증이 이미 완료되었습니다.");
                    onSuccess();
                    break;
                case "CF-03002":
                    Alert.alert('인증 실패', "인증을 완료해주세요.");
                    break;
                case "CF-12001":
                    Alert.alert('인증 실패', "요청 시간이 초과되었습니다. 잠시 기다렸다가 다시 시도해주세요");
                    onClose();
                    break;
                case "CF-00016":
                    Alert.alert('인증 실패', "동일한 요청이 처리 중입니다. 잠시 기다렸다가 다시 시도해주세요");
                    onClose();
                    break;
                default:
                    Alert.alert('인증 실패', "인증에 실패하였습니다.");
                    onClose();
            }
        } catch (error) {
            /* setModalVisible(false); */
            console.log("error: ", error);
            Alert.alert('인증 실패', error.response ? error.response.data.message : error.message);
        }
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
        marginTop: 30,
        padding: 10,
        borderRadius: 5,
    },
    successButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default PassModal;
