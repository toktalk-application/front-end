import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, Image } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import sendPostRequest from '../axios/SendPostRequest';
import { useNavigation } from '@react-navigation/native';

const ReviewModal = ({ visible, onClose, reservationId, onSubmit }) => {
    const { state } = useAuth();
    const navigation = useNavigation();
    const [reviewContent, setReviewContent] = useState('');
    const [rating, setRating] = useState(0); // 별 점수를 위한 상태

    const handleSubmit = async () => {
        if (reviewContent.trim() === '') {
            Alert.alert("경고", "후기 내용을 입력해주세요.");
            return;
        }

        const requestBody = {
            content: reviewContent,
            rating: rating,
        };

        const token = state.token;

        try {
            await sendPostRequest({
                token,
                endPoint: `/reservations/${reservationId}/reviews`,
                requestBody,
                onSuccess: (data) => {
                    Alert.alert("성공", "후기가 성공적으로 작성되었습니다.");
                    onSubmit(); // 모달 닫기
                    setReviewContent(''); // 입력 초기화
                    setRating(0); // 별점 초기화
                },
                /* onFailure: () => {
                    Alert.alert("실패", "후기 작성에 실패했습니다.");
                } */
            });
        } catch (error) {
            console.error("후기 작성 중 오류 발생:", error);
            Alert.alert("오류", "후기 작성 중 오류가 발생했습니다.");
        }
    };

    const handleStarPress = (index) => {
        setRating(index + 1); // 선택된 별 점수 설정
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
                    <Text style={styles.sectionTitle}>상담 리뷰 작성</Text>
                    <View style={styles.starContainer}>
                        {Array.from({ length: 5 }, (_, index) => (
                            <TouchableOpacity key={index} onPress={() => handleStarPress(index)}>
                                <Image 
                                    source={index < rating ? require('../../assets/images/starYellow.png') : require('../../assets/images/starGray.png')} 
                                    style={styles.star} 
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TextInput
                        style={styles.bingInput}
                        placeholder="입력해주세요"
                        value={reviewContent}
                        onChangeText={setReviewContent}
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                    />


                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>작성 완료</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.sectionDescription}>- 더 나은 상담을 위해 참고할 예정입니다.</Text>
                    <TouchableOpacity 
                        style={styles.laterButton}                         
                        onPress={() => {
                            onClose(); // 모달 닫기
                            navigation.navigate('채팅'); // 채팅 화면으로 이동
                        }}
                    >
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
    starContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        marginTop:10,
    },
    star: {
        width: 30,
        height: 30,
        margin: 5,
    },
    bingInput: {
        height: 200,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
        width: '100%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    submitButton: {
        backgroundColor: '#215D9A',
        borderRadius: 5,
        padding: 10,
        flex: 1,
        marginRight: 5,
        alignItems: 'center',
    },
    submitButtonText: {
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

export default ReviewModal;
