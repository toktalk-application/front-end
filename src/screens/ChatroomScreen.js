import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, FlatList, KeyboardAvoidingView, Animated, Platform, Alert, Linking, Modal, Button } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { PermissionsAndroid } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import ReportModal from '../components/ReportModal';
import ReviewModal from '../components/ReviewModal';

const ChatRoomScreen = () => {
  const { state } = useAuth();
  const route = useRoute();
  const navigation = useNavigation();
  const { roomId, memberNickname, counselorName } = route.params;

  const [messages, setMessages] = useState([]); // 메시지 상태.
  const [messageInput, setMessageInput] = useState(''); // 입력 필드 상태
  const flatListRef = useRef(null); // FlatList에 대한 참조
  const [isButtonVisible, setButtonVisible] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current; 
  const socketRef = useRef(null); // 웹소켓 참조
  const [inputHeight, setInputHeight] = useState(60); 
  const maxHeight = 100; //input 값 최대. 

  // 모달 열고 닫는 상태. 
  // 상담 종료 버튼을 누르면, 종료하시겠습니까? 모달이 뜬 후 '예' 버튼 누르면 상담 종료됨. 
  const [isEndModalVisible, setEndModalVisible] = useState(false);
  // 상담이 종료되면 상담사에게는 ReportModal, 멤버에게는 ReviewModal이 떠야 함. 
  const [isReportModalVisible, setReportModalVisible] = useState(false);
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);

  const userType = state.usertype;

  useEffect(() => {
    // 웹소켓 연결 설정
    socketRef.current = new WebSocket(`wss://your-websocket-server.com/${roomId}`);

    socketRef.current.onopen = () => {
      console.log('웹소켓 연결됨');
    };

    socketRef.current.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [receivedMessage, ...prevMessages]); // 수신된 메시지 추가
    };

    socketRef.current.onclose = () => {
      console.log('웹소켓 연결 종료됨');
    };

    return () => {
      socketRef.current.close(); // 컴포넌트 언마운트 시 웹소켓 연결 종료
    };
  }, [roomId]);

  // 전화 버튼 클릭 후. 권한 요청, 소켓 여는 로직. 
  const handleCall = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      Alert.alert('권한 요청', '마이크 권한이 필요합니다. 권한을 허용해 주세요.', [
        { text: '취소', style: 'cancel' },
        { text: '설정', onPress: () => openSettings() },
      ]);
      return;
    }

    const callRequest = {
      type: 'CALL_REQUEST',
      from: '은하늘', // 실제 사용자 ID로 변경
      to: memberNickname, // 상대방 ID로 변경
    };

    socketRef.current.send(JSON.stringify(callRequest));
    console.log('전화 요청 전송:', callRequest);
  };
  const requestMicrophonePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };
  const openSettings = () => {
    // 설정 앱으로 이동 (Android)
    Linking.openSettings();
  }

  // + 버튼 x 로 회전.
  const toggleButtons = () => {
    setButtonVisible(!isButtonVisible);
    Animated.timing(rotation, {
      toValue: isButtonVisible ? 0 : 1, // 상태에 따라 회전 값 변경
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  const interpolatedRotation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'], // 0도에서 45도로 회전
  });

  // 상담 종료 버튼 관리. 
  const handleChatRoomClose = () => {
    // 상담을 종료하시겠습니까? 모달이 뜸. 
    setEndModalVisible(true);
  };
  // 상담 종료하시겠습니까? 모달이 뜬 후 예. 버튼 눌렀을 때 채팅방 상태 close로 변경하는 로직 추가 해야. 
  const handleConfirmEnd = () => {
    setEndModalVisible(false);

    // 채팅방 상태가 close 로 바꿘 뒤 
    // COUNSELOR > reportModal open, MEMBER > reviewModal open. 
    if (userType === 'COUNSELOR') {
        setReportModalVisible(true);
    } else {
        setReviewModalVisible(true);
    }
  };




  // 문자 전송 하는 로직으로 수정. 현재는 프론트에서 Messages에 상태를 담고만 있음. 
  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        sender: '은하늘', 
        message: messageInput,
        createdAt: new Date().toISOString(),
      };
      setMessages((prevMessages) => [newMessage, ...prevMessages]); // 새로운 메시지 추가
      setMessageInput(''); // 입력 필드 초기화
      setInputHeight(60);

      // 메시지를 서버로 전송
      socketRef.current.send(JSON.stringify(newMessage));

      // 메시지 추가 후 FlatList의 끝으로 스크롤
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };
  // chatLog 데이터의 sender 를 보고, 내가 보낸 메시지 인지, 남이 보낸 메시지 인지 확인 하고 styles 적용. 
  // 후에 서버에서 chatLog 데이터 받아 처리해야 함.  
  const renderMessage = ({ item }) => {
    const nickname = state.nickname;
    const name = state.name;

    // 사용자가 member로 로그인했을 때, 현재 로그인한 사람의 nickname과 item.sender가 다르면 
    // isOtherMessage가 true가 됨.
    // 사용자가 counselor로 로그인했을 때, 현재 로그인한 사람의 name과 item.sender가 다르면 
    // isOtherMessage가 true가 됨.
    // isOtehrMessage 가 true 이면 아래 styles.oterMessage style 값을 가짐. 
    const isOtherMessage = userType === 'member' ? nickname !== item.sender 
        : userType === 'counselor' ? name !== item.sender : false;
    
    
    return (
      <View style={[styles.messageContainer, isOtherMessage ? styles.otherMessage : styles.myMessage]}>
        {!isOtherMessage && (
          <Text style={styles.myTimestamp}>
            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
        <Text style={[styles.messageText, isOtherMessage ? styles.oterhMessageColor : styles.myMessageColor]}>{item.message}</Text>
        {isOtherMessage && (
          <Text style={styles.otherTimestamp}>
            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../../assets/images/back.png')} style={styles.icon} />
        </TouchableOpacity>
        {userType === 'COUNSELOR' ? (
              <Text style={styles.memberName}>{memberNickname} 내담자</Text>
            ) : userType === 'MEMBER' ? (
              <Text style={styles.memberName}>{counselorName} 상담사</Text>
            ) : null}
      </View>
      <FlatList
        ref={flatListRef} // FlatList에 ref 추가
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()} // 인덱스를 키로 사용
        contentContainerStyle={styles.chatContainer}
        inverted={true} // 최신 메시지가 아래에 오도록 설정
      />
      <View style={styles.inputContainer}>
            {userType !== 'MEMBER' && (
                    <TouchableOpacity style={styles.plusButton} onPress={toggleButtons}>
                        <Animated.Image 
                            source={require('../../assets/images/plus.png')} 
                            style={[styles.plusButtonImg, { transform: [{ rotate: interpolatedRotation }] }]} 
                        />
                    </TouchableOpacity>
                )}
          <TextInput
                style={[styles.input, { height: inputHeight }]} // 동적으로 높이 설정
                placeholder="메시지를 입력하세요..."
                value={messageInput}
                onChangeText={setMessageInput}
                onSubmitEditing={handleSendMessage} // Enter 키로 메시지 전송
                multiline={true} // 멀티라인 설정
                onContentSizeChange={(e) => {
                  const { height } = e.nativeEvent.contentSize; // nativeEvent를 사용하여 높이 가져오기
                  // 최대 높이를 초과하지 않도록 설정
                  if (height <= maxHeight) {
                      setInputHeight(height);
                  }
                }}
              // 텍스트가 삭제될 때 높이를 재조정
                onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === 'Backspace') {
                        setInputHeight(Math.max(40, inputHeight - 20)); // 기본 높이로 리셋
                    }
                }}
            />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Image source={require('../../assets/images/send.png')} style={styles.sendButtonText}/>
        </TouchableOpacity>
      </View>
      {isButtonVisible && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.callButton} onPress={handleCall}>
            <View style={styles.ImageCover}>
                <Image source={require('../../assets/images/call.png')} style={styles.callButtonImg}/>
            </View>
            <Text style={styles.callText}>전화</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.callButton} onPress={handleChatRoomClose}>
            <View style={styles.ImageCover}>
                <Image source={require('../../assets/images/exist.png')} style={styles.callButtonImg}/>
            </View>
            <Text style={styles.callText}>상담 종료</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* 상담 종료 확인 모달 */}
      <Modal
        transparent={true}
        visible={isEndModalVisible}
        animationType="slide"
      >
        <View style={{ flex: 1, justifyContent: 'center', 
                       alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ width: 350, padding: 20, backgroundColor: 'white', 
                           borderRadius: 10, alignItems: 'center' }}>
                <Text style={{fontSize:20}}>상담을 종료하시겠습니까?</Text>
                <View style={styles.modalButtonContainer}>
                    <TouchableOpacity onPress={handleConfirmEnd} style={[styles.confirmButton]}>
                        <Text style={styles.buttonText}>예</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setEndModalVisible(false)} style={[styles.cancelButton]}>
                        <Text style={styles.buttonText}>아니요</Text>
                    </TouchableOpacity>
                </View>
            </View>
         </View>
      </Modal>

      {/* 리포트 모달 */}
      <ReportModal
          visible={isReportModalVisible}
          onClose={() => setReportModalVisible(false)}
          onSubmit={() => setReportModalVisible(false)} // 제출 후 모달 닫기
      />

      {/* 리뷰 모달 */}
      <ReviewModal
          visible={isReviewModalVisible}
          onClose={() => setReviewModalVisible(false)}
          onSubmit={() => setReviewModalVisible(false)} // 제출 후 모달 닫기
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 25,
  },
  backButton: {
    marginRight: 10,
  },
  icon: {
    width: 20,
    height: 20,
  },
  memberName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    flex: 1,
  },
  chatContainer: {
    padding: 10,
  },
  messageContainer: {
    flexDirection: 'row', // 메시지와 타임스탬프를 가로로 정렬
    alignItems: 'center', // 중앙 정렬
  },
  otherMessage: {
    alignSelf: 'flex-start',
    alignItems: 'flex-end',
  },
  oterhMessageColor:{
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '100%', 
    backgroundColor: '#f1f0f0',
  },
  myMessage: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  myMessageColor: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%', 
    backgroundColor: '#99A5B2', 
    color:'#F1F1F1'
  },
  messageText: {
    fontSize: 14,
    marginHorizontal:5
  },
  myTimestamp: {
    fontSize: 11,
    color: '#888',
    marginLeft: 5, // 메시지와 타임스탬프 사이의 간격
    marginBottom: 7 
  },
  otherTimestamp: {
    fontSize: 11,
    color: '#888',
    marginRight: 5, // 메시지와 타임스탬프 사이의 간격
    marginLieft: 5,
    marginTop:3,
    marginBottom: 7 
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: 'white',
    marginBottom:15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical:10,
    marginHorizontal:10,
    marginTop:2
  },
  sendButton: {
    backgroundColor:'#001F3F',
    borderRadius: 20,
    padding: 10,
    marginTop:2,
    marginRight:10
  },
  sendButtonText: {
    width:20,
    height:20
  },
  plusButton:{
    marginLeft:10,
    marginRight:5
  },
  plusButtonImg:{
    width:25,
    height:25
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginBottom:20
  },
  ImageCover: {
    backgroundColor:'#F1F1F1',
    borderRadius: 30,
    padding: 18,
    marginBottom:10
  },
  callButton: {
    marginHorizontal: 40, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButtonImg:{
    width:20,
    height:20
  },
  disabledButton: {
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 40, 
  },
  callText: {
    color: 'black',
    fontWeight: 'bold',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginTop: 50,
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: '#3C6894', // 예 버튼 배경색
    paddingHorizontal:30,
    paddingVertical:10,
    borderRadius: 10,
  },
  cancelButton: {
      backgroundColor: '#CA6767', // 아니요 버튼 배경색
      paddingHorizontal:17,
      paddingVertical:10,
      borderRadius: 10,
  },
  buttonText:{
    color: 'white', // 버튼 텍스트 색
    textAlign: 'center',
    fontSize: 16,
  }
  
});

export default ChatRoomScreen;
