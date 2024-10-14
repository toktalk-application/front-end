import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, BackHandler } from 'react-native';
import sendGetRequest from '../../axios/SendGetRequest'; // sendGetRequest 경로를 수정하세요
import { useAuth } from '../../auth/AuthContext';

const TestResultScreen = ({ navigation }) => {
    const { state } = useAuth();
    const [testResults, setTestResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const page = 1; // 페이지 번호 (예: 1페이지)
    const size = 100; // 페이지 당 항목 수
    const endPoint = '/test'; // API 엔드포인트를 여기에 입력하세요

    useEffect(() => {
        const fetchTestResults = async () => {
            setLoading(true); // 로딩 시작
            setError(null); // 오류 초기화

            // sendGetRequest 호출
            sendGetRequest({
                token: state.token,
                endPoint: endPoint,
                requestParams: { page, size },
                onSuccess: (data) => {
                    // 응답에서 테스트 결과 데이터 설정
                    const sortedResults = data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setTestResults(sortedResults); // 최신 순으로 정렬하여 상태 업데이트
                },
                /* onFailure: () => {
                    setError('테스트 결과를 가져오는 데 실패했습니다.');
                }, */
            });

            setLoading(false); // 로딩 종료
        };
        

        fetchTestResults();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>오류가 발생했습니다: {error}</Text>
            </View>
        );
    }

    const renderItem = ({ item }) => (
        <View style={styles.resultCard}>
            <Text style={styles.title}>총 점수 {item.score}</Text>
            <Text style={styles.date}>검사일: {new Date(item.createdAt).toLocaleDateString()}</Text>
            <Text style={styles.description}>수준: {item.description}</Text>
            <Text style={styles.comment}>코멘트: {item.comment}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={testResults}
                renderItem={renderItem}
                keyExtractor={(item) => item.createdAt} // 고유 키로 createdAt 사용
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    listContainer: {
        paddingBottom: 20,
    },
    resultCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
        marginVertical: 5,
    },
    comment: {
        fontSize: 16,
        marginVertical: 5,
    },
    date: {
        fontSize: 14,
        color: '#888',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default TestResultScreen;
