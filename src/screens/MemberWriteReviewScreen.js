import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert,TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const MemberWriteReviewScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { reservationId } = route.params;

    const [reviewContent, setReviewContent] = useState('');

    const handleSubmit = () => {
        // 리포트를 제출하는 로직을 여기에 추가
        if (reviewContent.trim() === '') {
            Alert.alert("경고", "모든 필드를 입력해주세요.");
            return;
        }
        
        // 예: API 호출 등
        console.log("후기 작성 완료:", { reservationId, reportContent });
        navigation.goBack(); // 이전 화면으로 돌아가기
    };

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>후기</Text>
                <Text style={styles.sectionDescription}>- 상담 후기를 작성해주세요.</Text> 
                
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
