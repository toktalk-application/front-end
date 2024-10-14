import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../auth/AuthContext';
import sendGetRequest from '../axios/SendGetRequest';
import { Client } from '@stomp/stompjs';

const ChatRoomScreen = () => {
  const { state } = useAuth();
  const route = useRoute();
  const { roomId, memberNickname, counselorName } = route.params;

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const flatListRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const stompClient = useRef(null);
  const userType = state.usertype;

  useEffect(() => {
    const fetchChatRoomInfo = () => {
      sendGetRequest({
        token: state.token,
        endPoint: `/chat_rooms/${roomId}`,
        onSuccess: (data) => {
          const sortedMessages = data.chatLogs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          setMessages(sortedMessages);
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
    const client = new Client({
      webSocketFactory: () => new WebSocket('ws://10.0.2.2:8080/ws/chat'),
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('STOMP 연결 성공');
        client.subscribe(`/topic/chat/${roomId}`, onMessageReceived);
      },
      onStompError: (frame) => {
        console.error('STOMP 오류:', frame);
      },
      onWebSocketError: (event) => {
        console.error('WebSocket 오류:', event);
      },
    });
  
    client.activate();
    stompClient.current = client;
  
    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [roomId]);

  const onMessageReceived = (payload) => {
    console.log('메시지 수신:', payload.body);
    const newMessage = JSON.parse(payload.body);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleSendMessage = () => {
    if (messageInput.trim() && stompClient.current && stompClient.current.connected) {
      const newMessage = {
        sender: userType === 'COUNSELOR' ? state.name : state.nickname,
        message: messageInput,
      };
      console.log('메시지 전송:', newMessage);
      stompClient.current.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify(newMessage)
      });
      setMessageInput('');
    } else {
      console.error('STOMP client is not connected or message is empty');
    }
  };


  // 메시지 렌더링 함수
  const renderMessage = ({ item }) => {
    const isMyMessage = userType === 'MEMBER' ? state.nickname === item.sender : state.name === item.sender;

    return (
      <View style={[styles.messageContainer, isMyMessage ? styles.myMessage : styles.otherMessage]}>
        {!isMyMessage && <Text style={styles.senderName}>{item.sender}</Text>}
        <Text style={styles.messageText}>{item.message}</Text>
        <Text style={styles.timestamp}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
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
      <FlatList
        ref={flatListRef} // FlatList에 ref 추가
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()} // 인덱스를 키로 사용
        contentContainerStyle={styles.chatContainer}
        inverted={false} // 메시지를 과거 순서대로 표시 (최신 메시지 아래로)
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="메시지를 입력하세요..."
          value={messageInput}
          onChangeText={setMessageInput}
          onSubmitEditing={handleSendMessage} // Enter 키로 메시지 전송
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>전송</Text>
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
  chatContainer: {
    padding: 10,
  },
  messageContainer: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#99A5B2', // 자신의 메시지 배경색
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f0f0', // 상대방 메시지 배경색
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  senderName: {
    fontSize: 14,
    color: '#007AFF', // 상대방 이름 색상
    marginBottom: 5, // 이름과 메시지 간 간격
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
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
});

export default ChatRoomScreen;
