import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import sendPostRequest from '../axios/SendPostRequest';
import { useNavigation } from '@react-navigation/native'; 

const ReportModal = ({ visible, onClose, reservationId, onSubmit }) => {
    const { state } = useAuth();
    const navigation = useNavigation();
    const [reportContent, setReportContent] = useState('');

    const handleSubmit = async () => {
        if (reportContent.trim() === '') {
            Alert.alert("경고", "리포트 내용을 입력해주세요.");
            return;
        }

        const requestBody = {
            content: reportContent
        };

        const token = state.token;

        try {
            await sendPostRequest({
                token,
                endPoint: `/reservations/${reservationId}/reports`,
                requestBody,
                onSuccess: (data) => {
                    Alert.alert("성공", "리포트가 성공적으로 작성되었습니다.");
                    onSubmit(); // 모달 닫기
                    setReportContent(''); // 입력 초기화
                },
                /* onFailure: () => {
                    Alert.alert("실패", "리포트 작성에 실패했습니다.");
                } */
            });
        } catch (error) {
            console.error("리포트 작성 중 오류 발생:", error);
            Alert.alert("오류", "리포트 작성 중 오류가 발생했습니다.");
        }
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.sectionDescription}>상담이 종료되었습니다.</Text>
                    <Text style={styles.sectionTitle}>상담 리포트 작성</Text>

                        <Text style={styles.sectionDescription}>
                            - 상담 내용 및 피드백을 작성해주세요.
                        </Text>
                    <View style={{ alignItems: 'flex-start',marginBottom:20}}>
                        <Text style={styles.sectionDescriptionDetail}>
                            상담 중 내담자가 언급한 문제점, 요구사항, 논의한 주요 주제
                        </Text>
                        <Text style={styles.sectionDescriptionDetail}>
                            상담 중 제안된 대처 방법이나 행동 계획
                        </Text>
                        <Text style={styles.sectionDescriptionDetail}>
                            내담자에게 요청한 후속 행동 등
                        </Text>
                    </View>

                    <TextInput
                        style={styles.bingInput}
                        placeholder="입력해주세요"
                        value={reportContent}
                        onChangeText={setReportContent}
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                    />

                    <Text style={styles.sectionDescription}>
                            - 리포트 내용은 내담자에게 전송됩니다.
                        </Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>작성 완료</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.laterButton}                         
                            onPress={() => {
                            onClose(); // 모달 닫기
                            navigation.navigate('채팅'); // 채팅 화면으로 이동
                        }}>
                        <Text style={styles.laterButtonText}>다음에 작성하기</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '90%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sectionDescription: {
        fontSize: 14,
        marginBottom: 5,
        color: '#555',
    },
    sectionDescriptionDetail: {
        fontSize: 12,
        marginBottom: 3,
        color: '#666',

    },
    bingInput: {
        height: 200,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 40,
        backgroundColor: '#fff',
        width: '100%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    submitButton: {
        backgroundColor: '#001326',
        borderRadius: 5,
        padding: 10,
        flex: 1,
        marginRight: 5,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#6c757d',
        borderRadius: 5,
        padding: 10,
        flex: 1,
        marginLeft: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    laterButton: {
        marginTop: 20,
        alignSelf: 'flex-end', // 오른쪽 정렬
        marginBottom: 10,
    },
    laterButtonText: {
        fontSize: 12,
        textDecorationLine: 'underline', // 밑줄
        color: '#707780', // 원하는 색상으로 설정
    },
});

export default ReportModal;
