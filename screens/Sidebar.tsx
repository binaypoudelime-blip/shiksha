import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faMagnifyingGlass,
  faPlus,
  faFileLines,
  faClipboardQuestion,
  faClone,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

// Interfaces from the original ChatScreen that are relevant to Sidebar
interface UserProfile {
  _id: string;
  name: string;
}

interface ChatHistoryItem {
  _id:string;
  title: string;
}

interface SidebarProps {
  theme: any;
  width: number;
  userProfile: UserProfile | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  startNewChat: () => void;
  isLoadingHistory: boolean;
  errorFetchingHistory: string | null;
  filteredChatHistory: ChatHistoryItem[];
  selectedChatId: string | null;
  handleSelectChat: (chatId: string) => void;
  setIsSidebarOpen: (isOpen: boolean) => void;
  setCurrentScreen: (screen: string) => void;
  getUserInitials: (name: string | undefined) => string;
}

const Sidebar: React.FC<SidebarProps> = ({
  theme,
  width,
  userProfile,
  searchQuery,
  setSearchQuery,
  startNewChat,
  isLoadingHistory,
  errorFetchingHistory,
  filteredChatHistory,
  selectedChatId,
  handleSelectChat,
  setIsSidebarOpen,
  setCurrentScreen,
  getUserInitials,
}) => {
  const displayName = userProfile ? userProfile.name : 'Guest User';
  const displayInitials = getUserInitials(userProfile?.name);

  return (
    <View style={[styles.sidebar, { width: width * 0.75, backgroundColor: theme.background }]}>
      <View style={styles.sidebarHeader}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={[styles.searchInput, { color: theme.text, backgroundColor: theme.secondary }]}
            placeholder="Search"
            placeholderTextColor={theme.text === '#FFFFFF' ? '#9CA3AF' : '#6B7280'}
            onChangeText={setSearchQuery}
            value={searchQuery}
          />
          <View style={styles.searchIcon}>
            <FontAwesomeIcon
              icon={faMagnifyingGlass as IconProp}
              size={16}
              color={theme.text}
            />
          </View>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.flex1} contentContainerStyle={styles.sidebarNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={startNewChat}
        >
          <FontAwesomeIcon
            icon={faPlus as IconProp}
            size={20}
            color={'#8d92a0ff'}
            style={styles.navButtonIcon}
          />
          <Text style={[styles.navButtonText, { color: theme.text }]}>New Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <FontAwesomeIcon
            icon={faFileLines as IconProp}
            size={20}
            color={theme.primary}
            style={styles.navButtonIcon}
          />
          <Text style={[styles.navButtonText, { color: theme.text }]}>Summarizer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <FontAwesomeIcon
            icon={faClipboardQuestion as IconProp}
            size={20}
            color={'#b034b9ff'}
            style={styles.navButtonIcon}
          />
          <Text style={[styles.navButtonText, { color: theme.text }]}>Quiz Generator</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <FontAwesomeIcon
            icon={faClone as IconProp}
            size={20}
            color={'#4c40a7ff'}
            style={styles.navButtonIcon}
          />
          <Text style={[styles.navButtonText, { color: theme.text }]}>Flash Card</Text>
        </TouchableOpacity>
        <View style={styles.chatHistorySection}>
          <Text style={[styles.chatHistoryHeader, { color: theme.text }]}>Recent</Text>
          {isLoadingHistory && <ActivityIndicator color={theme.text} />}
          {errorFetchingHistory && <Text style={[styles.errorText, { color: theme.text }]}>Error: {errorFetchingHistory}</Text>}
          {!isLoadingHistory && !errorFetchingHistory && filteredChatHistory.length === 0 && (
            <Text style={[styles.noHistoryText, { color: theme.text }]}>No conversations found.</Text>
          )}
          {filteredChatHistory.map((chat: ChatHistoryItem) => (
            <TouchableOpacity
              key={chat._id}
              style={[
                styles.chatHistoryItem,
                chat._id === selectedChatId && { backgroundColor: theme.secondary },
              ]}
              onPress={() => handleSelectChat(chat._id)}
            >
              <Text
                style={[
                  styles.chatHistoryItemText,
                  { color: theme.text },
                  chat._id === selectedChatId && { color: theme.text },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {chat.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={[styles.sidebarFooter, { borderTopColor: theme.card }]}>
        <TouchableOpacity
          onPress={() => {
            setIsSidebarOpen(false);
            setCurrentScreen('settings');
          }}
          style={styles.profileButton}
        >
          <View style={[styles.initialsIcon, { backgroundColor: theme.primary }]}>
            <Text style={styles.initialsText}>{displayInitials}</Text>
          </View>
          <Text style={[styles.profileButtonText, { color: theme.text }]}>{displayName}</Text>
          <FontAwesomeIcon
            icon={faChevronDown as IconProp}
            size={12}
            color={theme.text}
            style={styles.dropdownIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 50,
    flexDirection: 'column',
  },
  sidebarHeader: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchInputContainer: {
    flex: 1,
    marginRight: 8,
    position: 'relative',
  },
  searchInput: {
    width: '100%',
    paddingLeft: 40,
    borderRadius: 9999,
    height: 40,
    paddingVertical: 10,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: [{ translateY: -8 }],
  },
  sidebarNav: {
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  navButtonIcon: {
    marginRight: 12,
  },
  navButtonText: {
    lineHeight: 18,
    fontSize: 17,
    fontWeight: '500',
  },
  chatHistorySection: {
    marginBottom: 8,
    marginTop: 8,
  },
  chatHistoryHeader: {
    fontSize: 11,
    fontWeight: '400',
    textTransform: 'uppercase',
    marginBottom: 4,
    lineHeight: 14,
    paddingHorizontal: 10,
  },
  chatHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  chatHistoryItemText: {
    fontSize: 16,
    lineHeight: 24,
    flexShrink: 1,
  },
  sidebarFooter: {
    padding: 16,
    marginBottom: 15,
    borderTopWidth: 0.5,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
  },
  initialsIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  initialsText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileButtonText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  dropdownIcon: {
    marginLeft: 8,
  },
  errorText: {
    textAlign: 'center',
    paddingVertical: 10,
    color: '#FF4500',
  },
  noHistoryText: {
    textAlign: 'center',
    paddingVertical: 10,
  },
});

export default Sidebar;
