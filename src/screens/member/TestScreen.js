import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import sendPostRequest from '../../axios/SendPostRequest';
import { useAuth } from '../../auth/AuthContext';


const questions = [
  "일 또는 여가 활동을 하는데 흥미나 즐거움을       느끼지 못한다.",
  "기분이 가라앉거나 우울하거나 희망이 없다.",
  "잠이 들거나 계속 잠을 자는 것이 어렵거나 잠을    너무 많이 잔다.",
  "피곤하다고 느끼거나 기운이 거의 없다.",
  "입맛이 없거나 과식을 한다.",
  "자신을 부정적으로 보거나 자신이 실패자라고     느끼거나 자신 또는 가족을 실망시킨다.",
  "신문을 읽거나 텔레비전을 보는 것과 같은 일에    집중하는 것이 어렵다.",
  "다른 사람들이 주목할 정도로 너무 느리게 움직이거나 말을 하거나, 반대로 평상시보다 많이 움직여서 너무 안절부절 못하거나 들떠 있다.",
  "자신이 죽는 것이 더 낫다고 생각하거나 어떤 식으로든 자신을 해칠 것이라고 생각한다."
];

const TestScreen = () => {
  const { state } = useAuth();
  const navigation = useNavigation();
  const [responses, setResponses] = useState(Array(questions.length).fill(null)); // null로 초기화
  const progressAnim = useRef(new Animated.Value(0)).current; // 애니메이션 값 초기화
  const [selectedValues, setSelectedValues] = useState(Array(questions.length).fill(null));
  const scrollViewRef = useRef(); 

  const handleButtonPress = (questionIndex, value) => {
    const updatedValues = [...selectedValues];
    if (updatedValues[questionIndex] === value) {
      // 이미 선택된 값이면 취소
      updatedValues[questionIndex] = null;
    } else {
      // 새로운 값 선택
      updatedValues[questionIndex] = value;
    }
    setSelectedValues(updatedValues);

    // responses 배열 업데이트
    const updatedResponses = [...responses];
    updatedResponses[questionIndex] = updatedValues[questionIndex]; // 선택된 값으로 업데이트
    setResponses(updatedResponses); // responses 배열 업데이트

    // 다음 질문으로 스크롤
    if (updatedValues[questionIndex] !== null && questionIndex < questions.length - 1) {
      scrollViewRef.current.scrollTo({ y: (questionIndex + 1) * 142, animated: true });
    }

    // 프로그레스 바 애니메이션
    const totalAnswered = updatedValues.filter(response => response !== null).length;
    const progressPercentage = (totalAnswered / questions.length) * 100;

    Animated.timing(progressAnim, {
      toValue: progressPercentage,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleSubmit = () => {
    if (responses.includes(null)) { // null 체크
      Alert.alert("모든 문항에 답변을 해주세요.");
      return;
    }
  
    const totalScore = responses.reduce((acc, curr) => acc + curr, 0);

    // post 점수 보내는 로직. memberId, score

    sendPostRequest({
      token: state.token,
      endPoint: `/test`,
      requestBody: {
        score: totalScore
      },
      onSuccess: () => {
        // TestResultScreen으로 이동.  점수에 따라 보여지는 내용이 다름. 
        navigation.navigate('',)
        navigation.navigate('TestResult', { score: totalScore });
      },
      onFailure: () => {
          Alert.alert("오류", "테스트에 실패했습니다. 다시 시도해주세요.")
      }
  });

    Alert.alert("설문이 완료되었습니다!", `응답: ${responses.join(', ')}\n총 점수: ${totalScore}`, [
      {
        text: "확인",
        onPress: () => {
          navigation.goBack();
          setResponses(Array(questions.length).fill(null)); // 다시 초기화
        },
      },
    ]);
  };

  const totalAnswered = responses.filter(response => response !== null).length;
  const progressPercentage = (totalAnswered / questions.length) * 100;

  return (
    <View style={styles.container}>
      <View style={{ marginHorizontal: 10}}>
        <View >
          <View style={styles.header}>
            <Text style={styles.headerText}>한 주간 나의 경험이나 상태와 가장 일치하는 곳에 표시해주세요.</Text>
          </View>
          <View style={styles.headerProgress}>
            <Text style={styles.progress}>{progressPercentage.toFixed(0)}%</Text>
            <View style={styles.progressBar}>
              <Animated.View style={[styles.progressFill, { width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }) }]} />
            </View>
          </View>
        </View>
        <ScrollView ref={scrollViewRef} style={{ marginHorizontal: 10, marginBottom: 100 }}>
          {questions.map((question, index) => (
            <View key={index} style={styles.questionContainer}>
              <Text style={styles.questionText}>{`Q${index + 1}. ${question}`}</Text>
              <View style={styles.buttonContainer}>
                {[0, 1, 2, 3].map((value) => (
                  <TouchableOpacity
                    key={value}
                    style={[
                      styles.button,
                      selectedValues[index] === value && styles.selectedButton, // 선택된 버튼 스타일
                    ]}
                    onPress={() => handleButtonPress(index, value)}
                  >
                    <Text style={[
                      styles.buttonText,
                      selectedValues[index] === value && styles.selectedButtonText // 선택된 버튼 텍스트 색
                    ]}>
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.labelContainer}>
                <Text style={styles.labelText}>전혀 아니다</Text>
                <Text style={styles.labelText}>매우 그렇다</Text>
              </View>
              <View style={styles.separator} />
            </View>
          ))}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>제출하기</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center', // 가운데 정렬
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'center', // 가운데 정렬
    marginHorizontal:30
  },
  headerProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progress: {
    fontSize: 16,
    marginRight: 10, // 진행률 텍스트와 진행 바 사이의 간격
  },
  progressBar: {
    flex: 1, // 남은 공간을 차지하도록 설정
    height: 10,
    backgroundColor: '#d3d3d3',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#001F3F',
  },
  questionContainer: {
    marginBottom: 10,
  },
  questionText: {
    fontSize: 14,
    marginBottom: 20,
    marginHorizontal: 10,
    textAlign: 'center', 
    color:"#001F3F"
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginHorizontal:2
  },
  button: {
    flex: 1,
    marginHorizontal:17,
    borderWidth: 1,
    borderColor: '#001F3F',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#001F3F', // 선택된 버튼 배경 색
  },
  buttonText: {
    color: '#001F3F', // 기본 버튼 텍스트 색
  },
  selectedButtonText: {
    color: '#FFFFFF', // 선택된 버튼 텍스트 색
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  labelText: {
    fontSize: 12,
    color: '#707780',
  },
  separator: {
    height: 1,
    backgroundColor: '#d3d3d3',
    marginVertical: 10,
  },
  submitButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#001326',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
},
  submitButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
  },
});

export default TestScreen;
