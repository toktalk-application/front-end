import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TestResultScreen = ({ route }) => {
    const { score } = route.params; // score를 props로 받아옴

    let resultMessage = '';
    //et/

    return (
        <View style={styles.container}>
            <Text style={styles.title}>테스트 결과</Text>
            <Text style={styles.score}>총 점수: {score}</Text>
            <Text style={styles.result}>{resultMessage}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    score: {
        fontSize: 18,
        marginVertical: 10,
    },
    result: {
        fontSize: 16,
        textAlign: 'center',
    },
});

export default TestResultScreen;
