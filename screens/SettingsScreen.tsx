// SettingsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCircleExclamation, faRightFromBracket, faVoicemail, faMobile, faGraduationCap, faSchoolFlag, faCreditCardAlt } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { get } from '../apikit';
import { currentUsernUrl } from '../urls';

// Define the props interface for SettingsScreen
interface SettingsScreenProps {
  theme: {
    background: string;
    text: string;
    primary: string;
    card: string;
  };
  currentTheme: 'light' | 'dark'; // The actual theme string for logic
  setTheme: (theme: 'light' | 'dark') => void;
  onBack: () => void;
  onSignOut: () => void;
  accessToken: string | null;
}

// Define the user data interface based on the API response
interface UserData {
  _id: string;
  name: string;
  email: string;
  contact: string;
  entity: string;
  grade: string;
  created_at: string;
  updated_at: string;
  entity_info: {
    _id: string;
    name: string;
    address: string;
    contact: string;
    created_at: string;
    updated_at: string;
  };
}
const SettingsScreen: React.FC<SettingsScreenProps> = ({ theme, currentTheme, setTheme, onBack, onSignOut, accessToken  }) => {
  // State for user data, loading state, and error state
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch user data from the API
    const fetchUserData = async () => {
      // Check if the accessToken is available before making the request
      if (!accessToken) {
        setError("No access token provided.");
        setLoading(false);
        console.warn("Attempted to fetch user data without an access token.");
        return;
      }

      try {
        const response = await get(currentUsernUrl,accessToken);
        

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: UserData = await response.json();
        setUserData(data);
      } catch (e: any) {
        // Catch any errors during the fetch and set the error state
        setError(e.message || 'Failed to fetch user data');
        console.error("Failed to fetch user data:", e);
      } finally {
        // Always set loading to false when the fetch is complete
        setLoading(false);
      }
    };

    fetchUserData();
  }, [accessToken]);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
  };

  // Helper function to get user initials
  const getUserInitials = (name: string | undefined): string => {
    if (!name) return 'U'; // Default to 'U' if name is not available
    const parts = name.split(' ');
    if (parts.length > 1) {
      return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  return (
    <View style={[styles.flex1, { backgroundColor: theme.background }]}>
      {/* <StatusBar barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.background}  /> */}
      {/* Settings Header */}
      <View style={[styles.settingsHeader, { backgroundColor: theme.background }]}>
        <TouchableOpacity onPress={onBack} style={styles.headerButton}>
          <FontAwesomeIcon icon={faArrowLeft as IconProp} size={20} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.settingsHeaderText, { color: theme.text }]}>Settings</Text>
        <View style={styles.headerButtonPlaceholder} />
      </View>

      {/* Settings Content */}
      <ScrollView style={styles.flex1} contentContainerStyle={styles.settingsContent}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.text} style={styles.loadingIndicator} />
        ) : error ? (
          <Text style={[styles.errorText, { color: theme.text }]}>
            {error}
          </Text>
        ) : (
          <>
            {/* User Profile Section */}
            <View style={styles.userProfileSection}>
              <View style={[styles.initialsIcon, { backgroundColor: currentTheme === 'dark' ? '#3c3e41ff' : theme.primary }]}>
                <Text style={styles.initialsText}>
                  {getUserInitials(userData?.name)}
                </Text>
              </View>
              <View>
                <Text style={[styles.profileName, { color: theme.text }]}>
                  {userData?.name || 'User name'}
                </Text>
                <Text style={[styles.profileContact, { color: currentTheme === 'dark' ? '#aaacafff' : '#6b6c6dff' }]}>
                  {userData?.email || 'user email'}
                </Text>
                <Text style={[styles.profileContact, { color: currentTheme === 'dark' ? '#aaacafff' : '#6b6c6dff' }]}>
                  {userData?.contact || 'contact'}
                </Text>
              </View>
            </View>

            {/* Settings Menu Items */}
            <View style={styles.settingsMenuItems}>
              <TouchableOpacity style={[styles.menuItemButton]}>
                <FontAwesomeIcon icon={faVoicemail as IconProp} color={theme.text} size={20} />
                <Text style={[styles.menuItemText, { color: theme.text }]}>{userData?.email || 'user email'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.menuItemButton]}>
                <FontAwesomeIcon icon={faMobile as IconProp} color={theme.text} size={20} />
                <Text style={[styles.menuItemText, { color: theme.text }]}>{userData?.contact || 'contact'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.menuItemButton]}>
                <FontAwesomeIcon icon={faGraduationCap as IconProp} color={theme.text} size={20} />
                <Text style={[styles.menuItemText, { color: theme.text }]}>
                  Grade: {userData?.grade || 'N/A'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.menuItemButton]}>
                <FontAwesomeIcon icon={faSchoolFlag as IconProp} color={theme.text} size={20} />
                <Text style={[styles.menuItemText, { color: theme.text }]}>
                  School: {userData?.entity_info.name || 'N/A'}
                </Text>a
              </TouchableOpacity>
              <TouchableOpacity style={[styles.menuItemButton]}>
                <FontAwesomeIcon icon={faCircleExclamation as IconProp} color={theme.text} size={20} />
                <Text style={[styles.menuItemText, { color: theme.text }]}>About</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.menuItemButton]}>
                <FontAwesomeIcon icon={faCreditCardAlt as IconProp} color={theme.text} size={20} />
                <Text style={[styles.menuItemText, { color: theme.text }]}>Credit Usage: N/A</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onSignOut} style={[styles.signOutButton]}>
                <FontAwesomeIcon icon={faRightFromBracket as IconProp} style={styles.signOutIcon} size={20} />
                <Text style={styles.signOutText}>Sign out</Text>
              </TouchableOpacity>
            </View>

            {/* Theme Option */}
            <View style={[styles.themeOptionContainer, { borderColor: currentTheme === 'dark' ? '#888a8dff' : '#d1d1d1ff' }]}>
              <View style={styles.themeOptionInner}>
                <Text style={[styles.themeOptionLabel, { color: theme.text }]}>App Theme</Text>
                <View style={styles.themeButtons}>
                  <TouchableOpacity
                    onPress={() => handleThemeChange('light')}
                    style={[
                      styles.themeButton,
                      currentTheme === 'light' ? { backgroundColor: theme.primary } : { backgroundColor: theme.background }
                    ]}
                  >
                    <Text style={[styles.themeButtonText, { color: currentTheme === 'light' ? theme.card : theme.text }]}>Light</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleThemeChange('dark')}
                    style={[
                      styles.themeButton,
                      currentTheme === 'dark' ? { backgroundColor: theme.primary } : { backgroundColor: theme.background }
                    ]}
                  >
                    <Text style={[styles.themeButtonText, { color: currentTheme === 'dark' ? theme.card : theme.text }]}>Dark</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    
  },
  settingsHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    flex: 1,
    paddingLeft:55,
    //textAlign: 'center',
  },
  headerButton: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  headerButtonPlaceholder: {
    width: 20,
  },
  settingsContent: {
    padding: 16,
    
  },
  loadingIndicator: {
    marginTop: 50,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
  },
  userProfileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  initialsIcon: {
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  initialsText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
  },
  profileContact: {
    fontSize: 14,
  },
  settingsMenuItems: {
    marginBottom: 20,
  },
  menuItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    // borderRadius: 8,
    marginBottom: 8,
    //borderBottomWidth: 1,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 26,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  signOutIcon: {
    marginRight: 26,
    color: '#EF4444',
  },
  signOutText: {
    fontSize: 16,
    color: '#EF4444',
  },
  themeOptionContainer: {
    marginTop: 24,
    borderWidth: .2,
    borderRadius: 99,
  },
  themeOptionInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  themeOptionLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  themeButtons: {
    flexDirection: 'row',
  },
  themeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    marginHorizontal: 4,
    borderWidth:.3,
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SettingsScreen;
