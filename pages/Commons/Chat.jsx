import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, SafeAreaView, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';

const ChatDetail = ({ route, navigation }) => {
  const { chat } = route.params;
  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [messageId, setMessageId] = useState(1);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const websocket = new WebSocket('ws://192.168.1.3:8080/websocket-endpoint');

    websocket.onopen = () => {
      console.log('WebSocket connection opened');
      promptForUserName();
    };

    websocket.onmessage = (e) => {
      console.log('Received message:', e.data);
      const receivedMessage = JSON.parse(e.data);
      setChatMessages(prevMessages => [
        ...prevMessages,
        { id: receivedMessage.id, text: receivedMessage.text, sender: receivedMessage.sender, sent: false }
      ]);
    };

    websocket.onerror = (e) => {
      console.log('WebSocket error:', e);
    };

    websocket.onclose = (e) => {
      console.log('WebSocket connection closed:', e.code, e.reason);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const promptForUserName = () => {
    Alert.prompt(
      'Enter Your Name',
      '',
      [
        {
          text: 'OK',
          onPress: (name) => {
            if (name.trim()) {
              setUserName(name.trim());
            } else {
              Alert.alert('Invalid Name', 'Please enter a valid name.');
              promptForUserName();
            }
          }
        }
      ],
      'plain-text'
    );
  };

  const sendMessage = () => {
    if (ws && message.trim()) {
      const newMessage = { id: messageId, text: message, sender: userName };
      ws.send(JSON.stringify(newMessage));

      setChatMessages(prevMessages => [
        ...prevMessages,
        { id: messageId, text: message, sender: userName, sent: true }
      ]);
      setMessage('');
      setMessageId(prevId => prevId + 1);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Text style={styles.title}>Chat with {chat.name}</Text>
        <ScrollView style={styles.chatBox}>
          {chatMessages.map((msg, index) => (
            <View key={index} style={[styles.message, msg.sent ? styles.sentMessage : styles.receivedMessage]}>
              <Text style={styles.senderName}>{msg.sender}</Text>
              <Text>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChangeText={text => setMessage(text)}
            onSubmitEditing={sendMessage}
          />
          <Button title="Send" onPress={sendMessage} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  chatBox: {
    flex: 1,
    marginBottom: 20,
  },
  message: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  sentMessage: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#f1f1f1',
    alignSelf: 'flex-start',
  },
  senderName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    marginRight: 10,
  },
});

export default ChatDetail;
