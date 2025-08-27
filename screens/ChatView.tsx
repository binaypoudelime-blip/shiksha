import React, { RefObject } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faMicrophone,
  faArrowUp,
  faStop,
  faCopy,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Markdown from 'react-native-markdown-display';

// Interfaces from the original ChatScreen
interface UserProfile {
  name?: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

interface ChatViewProps {
  theme: any;
  userProfile: UserProfile | null;
  selectedChatId: string | null;
  messages: Message[];
  isLoadingMessages: boolean;
  errorFetchingMessages: string | null;
  isSendingMessage: boolean;
  scrollViewRef: React.RefObject<ScrollView | null>;
  handleLongPress: (message: Message, event: any) => void;
  handleCopy: (text: string, messageId: string) => void;
  copiedMessageId: string | null;
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleMicPress: () => void;
  handleCancelMic: () => void;
  isListening: boolean;
  hasMicPermission: boolean;
  markdownStyles: any;
   
}

const ChatView: React.FC<ChatViewProps> = ({
  theme,
  userProfile,
  selectedChatId,
  messages,
  isLoadingMessages,
  errorFetchingMessages,
  isSendingMessage,
  scrollViewRef,
  handleLongPress,
  handleCopy,
  copiedMessageId,
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleMicPress,
  handleCancelMic,
  isListening,
  hasMicPermission,
  markdownStyles
}) => {
  const isChatSelected = selectedChatId !== null;

  return (
    <View  style={styles.flex1}>
      {!isChatSelected && messages.length === 0 ? (
        <View style={[styles.chatMainContent, { backgroundColor: theme.background }]}>
          <Image
            source={require('../assets/icon.png')}
            style={styles.chatLogo}
          />
          <Text style={[styles.chatWelcomeText, { color: theme.text }]}>
            Hi{userProfile?.name ? `, ${userProfile.name.split(' ')[0]}` : ''}, I'm ShikshaGPT.
          </Text>
          <Text style={[styles.chatHelpText, { color: theme.text === '#FFFFFF' ? '#9CA3AF' : '#6B7280' }]}>
            How can I help you today?
          </Text>
        </View>
      ) : isLoadingMessages ? (
        <View style={[styles.chatMainContent, { backgroundColor: theme.background }]}>
          <ActivityIndicator color={theme.text} />
          <Text style={[styles.loadingText, { color: theme.text }]}>Loading messages...</Text>
        </View>
      ) : errorFetchingMessages ? (
        <View style={[styles.chatMainContent, { backgroundColor: theme.background }]}>
          <Text style={[styles.errorText, { color: theme.text }]}>Error: {errorFetchingMessages}</Text>
        </View>
      ) : (
        <ScrollView ref={scrollViewRef} style={[styles.messagesContainer, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false} contentContainerStyle={styles.messagesContentContainer} >
          {messages.map((message, index) => (
            <TouchableOpacity
              key={message.id}
              onLongPress={(event) => handleLongPress(message, event)}
              style={message.sender === 'user' ? styles.userMessageContainer : styles.aiMessageContainer}
            >
              {message.sender === 'ai' && (
                <View style={styles.aiAvatarHeader}>
                  <View style={styles.avatarContainer}>
                    <Image source={require('../assets/icon.png')} style={styles.aiLogo} />
                  </View>
                </View>
              )}
              <View style={[
                message.sender === 'user' ? styles.userMessageBubble : styles.aiMessageBubble,
                { backgroundColor: message.sender === 'ai' ? theme.background : theme.secondary, borderTopLeftRadius: message.sender === 'ai' ? 0 : 16, borderTopRightRadius: message.sender === 'user' ? 16 : 4, borderBottomRightRadius: message.sender === 'user' ? 4 : 16, borderBottomLeftRadius: message.sender === 'ai' ? 16 : 16 }
              ]}>
                <Markdown style={markdownStyles}>
                  {message.text}
                </Markdown>
              </View>
              {message.sender === 'ai' && index === messages.length - 1 && (
                <TouchableOpacity onPress={() => handleCopy(message.text, message.id)} style={styles.copyButton}>
                  <FontAwesomeIcon icon={copiedMessageId === message.id ? faCheck as IconProp : faCopy as IconProp} size={16} color={theme.secondarytext} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
          {isSendingMessage && (
            <View style={styles.aiMessageContainer}>
              <View style={styles.aiAvatarHeader}>
                <View style={styles.avatarContainer}>
                  <Image source={require('../assets/icon.png')} style={styles.aiLogo} />
                </View>
              </View>
              <View style={[styles.aiMessageBubble, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="small" color={theme.text} />
              </View>
            </View>
          )}
        </ScrollView>
      )}
      <View style={[styles.bottomContainer, { backgroundColor: theme.card }]}>
        <View style={[styles.messageInputWrapper, { backgroundColor: theme.card }]}>
          <TextInput
            style={[styles.messageTextInput, { color: theme.text }]}
            placeholder="Ask ShikshaGPT"
            placeholderTextColor={theme.text === '#FFFFFF' ? '#9CA3AF' : '#6B7280'}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline={true}
            numberOfLines={6}
            editable={!isSendingMessage}
          />
        </View>
        <View style={styles.bottomActions}>
          <View style={styles.leftActionButtons}>
            <TouchableOpacity style={[styles.plusButton, { backgroundColor: theme.secondaryaction }]}>
              <Text style={[styles.plusButtonText, { color: theme.secondarytext }]}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.deepThinkButton, { backgroundColor: theme.secondary }]}>
              <Text style={[styles.actionButtonText, { color: theme.text }]}>Deep Research</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rightActionButtons}>
            <TouchableOpacity
              onPress={handleMicPress}
              disabled={isSendingMessage || !hasMicPermission}
              style={[
                styles.micButton,
                { backgroundColor: isListening ? theme.primary : theme.secondaryaction },
              ]}
            >
              <FontAwesomeIcon
                icon={isListening ? faStop as IconProp : faMicrophone as IconProp}
                size={20}
                color={isListening ? '#FFF' : theme.secondarytext}
              />
            </TouchableOpacity>
            {isListening && (
              <TouchableOpacity
                onPress={handleCancelMic}
                disabled={isSendingMessage}
                style={[
                  styles.micButton,
                  { backgroundColor: theme.secondaryaction, marginLeft: 5 },
                ]}
              >
                <Text style={[styles.plusButtonText, { color: theme.secondarytext, fontSize: 18 }]}>Cancel</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={!newMessage.trim() || isSendingMessage || isListening}
              style={[
                styles.sendButton,
                newMessage.trim() && !isSendingMessage ? { backgroundColor: theme.primary } : { backgroundColor: `${theme.primary}60` },
                isListening && { backgroundColor: `${theme.primary}60` },
              ]}
            >
              <FontAwesomeIcon
                icon={faArrowUp as IconProp}
                size={20}
                color="#F3F4F6"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View >
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContentContainer: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  chatMainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  chatLogo: {
    width: 90,
    height: 90,
    marginBottom: 12,
  },
  aiLogo: {
    width: 40,
    height: 40,
    marginBottom: 1,
  },
  chatWelcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  chatHelpText: {
    fontSize: 15,
  },
  userMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  aiMessageContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userMessageBubble: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    maxWidth: '80%',
    flexGrow: 0,
  },
  aiMessageBubble: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    width: '100%',
    flexGrow: 0,
  },
  avatarContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  aiAvatarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  copyButton: {
    position: 'absolute',
    bottom: -20,
    left: 0,
    padding: 8,
  },
  bottomContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    paddingTop: 15,
    alignItems: 'center',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  messageInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
    paddingVertical: 8,
    borderRadius: 9999,
    width: '100%',
    marginBottom: 12,
  },
  messageTextInput: {
    flex: 1,
    paddingVertical: 0,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    textAlignVertical: 'top',
    minHeight: 24,
    maxHeight: 120,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  leftActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '400',
  },
  plusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  plusButtonText: {
    fontSize: 25,
    fontWeight: 'normal',
    lineHeight: 22,
  },
  deepThinkButton: {
    padding: 7,
    borderRadius: 9999,
  },
  micButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    paddingVertical: 10,
  },
  errorText: {
    textAlign: 'center',
    paddingVertical: 10,
    color: '#FF4500',
  },
});

export default ChatView;
