import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

const TestResultModal = ({ route, visible, onClose, navigation }) => {
    const { score = 0, comment = '', description = '', createdAt = new Date() } = route.params || {}; 

    let resultMessage = comment; // comment를 결과 메시지로 사용

    function formatDate(createdAt) {
        const date = new Date(createdAt);
        
        // 날짜 형식 설정
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작
        const year = String(date.getFullYear()).slice(-2); // 마지막 두 자리
    
        return `${year}.${month}.${day}`;
    }
    const formattedDate = formatDate(createdAt); 

    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={visible}
            onRequestClose={onClose} // 안드로이드 기기에서 모달 닫기
        >
            <View style={styles.modalContainer}>
                <View style={styles.resultContainer}>
                    <View style={styles.dateContainer}>
                        <Text style={styles.Resulttitle}>우울 검사 결과</Text>
                        <Text style={styles.date}>{formattedDate}</Text>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.scoreContainer}>
                            <Text style={styles.title}>총 점수</Text>
                            <Text style={styles.score}>{score}</Text>
                        </View>
                        <View style={styles.scoreContainer}>
                            <Text style={styles.title}>수준</Text>
                            <Text style={styles.description}>{description}</Text>
                        </View>
                    </View>
                    <View style={styles.explanationContainer}>
                    <Text style={styles.explainTitle}>설명</Text>
                    <Text style={styles.result}>{resultMessage}</Text>
                    </View>
                    <TouchableOpacity style={styles.closeButton} 
                                        onPress={() => {
                                            onClose(); // 모달 닫기
                                            navigation.navigate('내 정보'); // 원하는 화면으로 이동
                                        }}>
                        <Text style={styles.closeButtonText}>확인</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 배경 어둡게
    },
    resultContainer: {
        width: '90%', // 모달 너비 조정 (80%로 설정)
        height: '100px',
        backgroundColor: 'white', // 배경 색상
        borderRadius: 10,
        padding: 20,
        justifyContent: 'center', // 내용 중앙 정렬
    },
    Resulttitle: {
        fontSize: 25,
        fontWeight: 'bold',
        marginRight: 8,
        marginBottom: 10,
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '92%',
        marginBottom: 30,
        alignItems: 'center',
    },
    date: {
        fontSize: 18,
        marginRight: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    scoreContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 8,
        marginBottom: 2,
    },
    score: {
        fontSize: 18,
        marginRight: 5,
        marginTop: 0,
    },
    description: {
        fontSize: 18,
    },
    result: {
        fontSize: 16,
        textAlign: 'center',
        marginHorizontal: 35,
        lineHeight: 27,
    },
    explainTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 8,
        marginBottom: 5,
    },
    explanationContainer: {
        marginTop:30,
        alignItems: 'center',
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#001326',
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default TestResultModal;
