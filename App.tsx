// App.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import ChatScreen from './screens/ChatScreen';
import SettingsScreen from './screens/SettingsScreen';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


// Define the possible screen types and theme types
type ScreenType = 'splash' | 'login' | 'chat' | 'settings';
type ThemeType = 'light' | 'dark';

// Define the structure for the user profile data
interface UserProfile {
  _id: string;
  name: string;
  email: string;
  contact: string;
  grade: string;
  entity_info: {
    _id: string;
    name: string;
  };
}
 

// Define color palettes for themes
const lightTheme = {
  background: '#F3F4F6', // light-gray-100
  text: '#151515ff',
  secondarytext:'#4e4d4dff', // dark-gray-800
  primary: '#3B82F6', // blue-500
  card: '#ecedeeff', // white
  secondary:'#dfe7f5ff', 
  secondaryaction: '#e5e8ebff',
};

const darkTheme = {
  background: '#151515ff', // dark-gray-800
  text: '#F3F4F6',
  secondarytext:'#e5e6e7ff', // light-gray-100
  primary: '#3B82F6', // blue-500
  card: '#232424ff', // dark-gray-700
  secondary:'#393a3bff',
  secondaryaction:'#393a3bff'
};

const App: React.FC = () => {
  const colorScheme = useColorScheme();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [school, setSchool] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeType>(colorScheme === 'dark' ? 'dark' : 'light');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Check for saved access token and user profile on app start
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [token, savedTheme, savedUserProfile] = await Promise.all([
          AsyncStorage.getItem('accessToken'),
          AsyncStorage.getItem('app_theme'),
          AsyncStorage.getItem('userProfile'),
        ]);

        if (savedTheme === 'light' || savedTheme === 'dark') {
          setTheme(savedTheme as ThemeType);
        }

        if (token && savedUserProfile) {
          setAccessToken(token);
          setUserProfile(JSON.parse(savedUserProfile));
          setCurrentScreen('chat');
        } else {
          setCurrentScreen('login');
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
        setCurrentScreen('login');
      }
    };

    const timer = setTimeout(loadSettings, 2000); // splash delay
    return () => clearTimeout(timer);
  }, []);

  // The handleLogin function now also retrieves and sets the user profile
  const handleLogin = async (token: string) => {
    try {
      const savedUserProfile = await AsyncStorage.getItem('userProfile');
      if (savedUserProfile) {
        setUserProfile(JSON.parse(savedUserProfile));
        setAccessToken(token);
        setCurrentScreen('chat');
      } else {
        console.error('User profile not found after successful login.');
        setLoginError('User profile not found. Please try again.');
        setAccessToken(null);
      }
    } catch (error) {
      console.error('Failed to load user profile after login:', error);
      setLoginError('An error occurred during login. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('userProfile');
      setAccessToken(null);
      setCurrentScreen('login');
      setSchool('');
      setUsername('');
      setPassword('');
      setUserProfile(null);
    } catch (error) {
      console.error('Failed to remove token:', error);
      Toast.show({
        type: 'error',
        text1: 'Error signing out',
        text2: 'Please restart the app.',
      });
    }
  };

  const handleBackToChatWithSidebar = () => {
    setCurrentScreen('chat');
    setIsSidebarOpen(true);
  };

  const handleSetTheme = async (newTheme: ThemeType) => {
    try {
      await AsyncStorage.setItem('app_theme', newTheme);
      setTheme(newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const renderScreen = () => {
    const currentTheme = theme === 'light' ? lightTheme : darkTheme;

    switch (currentScreen) {
      case 'splash':
        return <SplashScreen theme={currentTheme} />;
      case 'login':
        return (
          <LoginScreen
            onLogin={handleLogin}
            school={school}
            setSchool={setSchool}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            loginError={loginError}
            setLoginError={setLoginError}
            theme={theme}
          />
        );
      case 'chat':
        if (accessToken && userProfile) {
          return (
            <ChatScreen
              theme={currentTheme}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              setCurrentScreen={setCurrentScreen}
              accessToken={accessToken}
              userProfile={userProfile}
            />
          );
        } else {
          return null; // Don't render chat screen without a token or user profile
        }
      case 'settings':
        return (
          <SettingsScreen
            theme={currentTheme}
            currentTheme={theme}
            setTheme={handleSetTheme}
            onBack={handleBackToChatWithSidebar}
            onSignOut={handleSignOut}
            accessToken={accessToken}
          />
        );
      default:
        return null;
    }
  };

    return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'} 
        backgroundColor={theme === 'light' ? lightTheme.background : darkTheme.background}
      />
      <SafeAreaView
        style={[
          styles.safeArea,
          { backgroundColor: theme === 'light' ? lightTheme.background : darkTheme.background }
        ]}
         edges={['top']} // 👈 control which sides to apply safe area padding
      >
        <View style={styles.contentContainer}>
          {renderScreen()}
        </View>
        <Toast />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
});

export default App;
