import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert,TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../auth/AuthContext';
import sendPostRequest from '../axios/SendPostRequest';

const MemberWriteReviewScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { reservationId } = route.params;
    const { state } = useAuth();
    const [reviewContent, setReviewContent] = useState('');
    const [rating, setRating] = useState(0); // 별 점수를 위한 상태

    const handleSubmit = async () => {
        // 리포트를 제출하는 로직을 여기에 추가
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
                    navigation.goBack(); // 이전 화면으로 돌아가기
                },
                /* onFailure: () => {
                    Alert.alert("실패", "후기 작성에 실패했습니다.");
                } */
            });
        } catch (error) {
            console.error("후기 작성 중 오류 발생:", error);
            Alert.alert("오류", "후기 작성 중 오류가 발생했습니다.");
        }

        navigation.goBack(); // 이전 화면으로 돌아가기
    };

    const handleStarPress = (index) => {
        setRating(index + 1); // 선택된 별 점수 설정
    };

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>상담 후기</Text>
                <Text style={styles.sectionDescription}>- 더 나은 상담을 위해 참고할 예정입니다.</Text> 
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
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>작성 완료</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    section: {
        marginBottom: 10,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    starContainer: {
        flexDirection: 'row',
    },
    star: {
        width: 30,
        height: 30,
        margin: 5,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    sectionDescription: {
        fontSize: 14,
        marginBottom: 8,
        color: '#555',
    },
    sectionDescriptionDetail:{
        fontSize: 11,
        marginBottom: 3,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginTop:10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    bingInput: {
        height: 250,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginTop:20,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    submitButton: {
        marginTop: 10,
        marginBottom: 40,
        padding: 10,
        backgroundColor: '#001326',
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default MemberWriteReviewScreen;
