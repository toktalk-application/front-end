import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert,TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../auth/AuthContext';
import sendPostRequest from '../axios/SendPostRequest';

const CounselWriteReportScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { reservationId } = route.params;
    const { state } = useAuth();

    const [reportContent, setReportContent] = useState('');

    const handleSubmit = async () => {
        // 리포트를 제출하는 로직을 여기에 추가
        if (reportContent.trim() === '') {
            Alert.alert("경고", "리포트 내용을 입력해주세요.");
            return;
        }
        const requestBody = {
            content: reportContent
        }
        const token = state.token;
        try {
            await sendPostRequest({
                token,
                endPoint: `/reservations/${reservationId}/reports`,
                requestBody,
                onSuccess: (data) => {
                    Alert.alert("성공", "리포트가 성공적으로 작성되었습니다.");
                    navigation.goBack(); // 이전 화면으로 돌아가기
                },
                /* onFailure: () => {
                    Alert.alert("실패", "리포트 작성에 실패했습니다.");
                } */

            })
        } catch (error) {
            console.error("리포트 작성 중 오류 발생:", error);
            Alert.alert("오류", "리포트 작성 중 오류가 발생했습니다.");
        }

    };

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>상담 리포트</Text>
                <Text style={styles.sectionDescription}>- 상담 내용 및 피드백을 작성해주세요.</Text>
                <Text style={styles.sectionDescriptionDetail}>상담 중 회원이 언급한 문제점, 요구사항, 논의한 주요 주제</Text>
                <Text style={styles.sectionDescriptionDetail}>상담 중 제안된 대처 방법이나 행동 계획</Text>
                <Text style={styles.sectionDescriptionDetail}>회원에게 요청한 후속 행동 등 </Text>     
                
                <TextInput 
                    style={styles.bingInput} 
                    placeholder="입력해주세요" 
                    value={reportContent} 
                    onChangeText={setReportContent} 
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
        backgroundColor: '#215D9A',
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
        backgroundColor: '#215D9A',
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default CounselWriteReportScreen;
