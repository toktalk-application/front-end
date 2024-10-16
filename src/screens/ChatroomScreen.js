import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator,Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../auth/AuthContext';
import sendGetRequest from '../axios/SendGetRequest';
import PatchRequest from '../axios/PatchRequest';
import io from 'socket.io-client';

const ChatRoomScreen = () => {
  const { state } = useAuth();
  const route = useRoute();
  const navigation = useNavigation();
  const { roomId, nickname, counselorName } = route.params;

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const flatListRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const [inputHeight, setInputHeight] = useState(60); 
  const userType = state.usertype;
  const maxHeight = 100; //input 값 최대. 
  

  useEffect(() => {
    const fetchChatRoomInfo = () => {
      sendGetRequest({
        token: state.token,
        endPoint: `/chat_rooms/${roomId}`,
        onSuccess: (data) => {
          const sortedMessages = data.chatLogs.sort((a, b) => b.logId - a.logId);
          setMessages(sortedMessages);
          console.log(messages);
          setLoading(false);
        },
        onFailure: () => {
          setError('채팅방 정보를 불러오는데 실패했습니다.');
          setLoading(false);
        },
      });
    };

    fetchChatRoomInfo();
  }, [roomId, state.token]);

  useEffect(() => {
    // Socket.IO 연결
    const socket = io('http://10.0.2.2:9092', {
      transports: ['websocket'],
      query: { roomId }
    });

    socket.on('connect', () => {
      console.log('Socket.IO 연결 성공');
      socket.emit('joinRoom', roomId);
    });

    socket.on('message', (newMessage) => {
      console.log('메시지 수신:', newMessage);
      setMessages((prevMessages) => [newMessage, ...prevMessages ]);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.IO 연결 오류:', error);
    });

    socketRef.current = socket;

    return () => {  
      if (socket) {
        socket.disconnect();
      }
    };
  }, [roomId]);

  const handleSendMessage = () => {
    if (messageInput.trim() && socketRef.current) {
      const newMessage = {
        sender: userType === 'COUNSELOR' ? state.name : state.nickname,
        message: messageInput,
        roomId: roomId
      };
      console.log('메시지 전송:', newMessage);
      socketRef.current.emit('message', newMessage);  // 클라이언트에서 'message' 이벤트 전송
      setMessageInput('');
      
    } else {
      console.error('Socket is not connected or message is empty');
    }
  };
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
    }, [messages]);
  useEffect(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ offset: 0, animated: true });
      }
    }, []);

  const handleCloseChatRoom = () => {
    PatchRequest({
      token: state.token,
      endPoint: `/chat_rooms/${roomId}/close`,  // roomId를 경로 파라미터로 전달
      onSuccess: () => {
        console.log("채팅방이 닫혔습니다.");
        // 채팅방이 닫힌 후 이전 화면으로 이동
        navigation.goBack();
      },
      onFailure: (errorStatus, errorMessage) => {
        Alert.alert("실패", `채팅방 닫기 실패: ${errorMessage}`);
      }
    });
  };
      
  // 메시지 렌더링 함수
  const renderMessage = ({ item }) => {
    const nickname = state.nickname;
    const name = state.name;

    // 사용자가 member로 로그인했을 때, 현재 로그인한 사람의 nickname과 item.sender가 다르면 
    // isOtherMessage가 true가 됨.
    // 사용자가 counselor로 로그인했을 때, 현재 로그인한 사람의 name과 item.sender가 다르면 
    // isOtherMessage가 true가 됨.
    // isOtehrMessage 가 true 이면 아래 styles.oterMessage style 값을 가짐. 
    const isOtherMessage = userType === 'MEMBER' ? nickname !== item.sender 
        : userType === 'COUNSELOR' ? name !== item.sender : false;
    
    
        return (
          <View style={[styles.messageContainer, isOtherMessage ? styles.otherMessage : styles.myMessage]}>
            {!isOtherMessage && (
              <Text style={styles.myTimestamp}>
                {item.timeOnly} {/* timeOnly 필드로 시간 표시 */}
              </Text>
            )}
            <Text style={[styles.messageText, isOtherMessage ? styles.oterhMessageColor : styles.myMessageColor]}>
              {item.message}
            </Text>
            {isOtherMessage && (
              <Text style={styles.otherTimestamp}>
                {item.timeOnly} {/* timeOnly 필드로 시간 표시 */}
              </Text>
            )}
          </View>
        );
  };


  // 로딩 중일 때 로딩 스피너 표시
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // 에러 발생 시 에러 메시지 표시
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../../assets/images/back.png')} style={styles.icon}/>
        </TouchableOpacity>
        {userType === 'COUNSELOR' ? (
              <Text style={styles.memberName}>{nickname} 내담자</Text>
            ) : userType === 'MEMBER' ? (
              <Text style={styles.memberName}>{counselorName} 상담사</Text>
            ) : null}
        <TouchableOpacity onPress={handleCloseChatRoom} style={styles.backButton}>
          <View style={styles.ImageCover}>
            <Image source={require('../../assets/images/exist.png')} style={styles.ExistButtonImg}/>
          </View>
        </TouchableOpacity>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.chatContainer}
        inverted={true}
      />
      <View style={styles.inputContainer}>
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
                        setInputHeight(Math.max(40, inputHeight - 10)); // 기본 높이로 리셋
                    }
                }}
            />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Image source={require('../../assets/images/send.png')} style={styles.sendButtonText}/>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// 스타일 정의
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
    width: 25,
    height: 25,
  },
  memberName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    flex: 1,
  },
  ImageCover: {
    backgroundColor:'#F1F1F1',
    borderRadius: 30,
    padding: 18,
  },
  ExistButtonImg:{
    width:15,
    height:15
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
  senderName: {
    fontSize: 14,
    color: '#007AFF', // 상대방 이름 색상
    marginBottom: 5, // 이름과 메시지 간 간격
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 30,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 10,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
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


});

export default ChatRoomScreen;
