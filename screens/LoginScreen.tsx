// LoginScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { entitiesUrl, loginUrl } from '../urls';
import { post } from '../apikit';
// Define the structure of a school object from the API response
interface SchoolEntity {
  _id: string;
  name: string;
  address: string;
  contact: string;
  created_at: string;
  updated_at: string;
}

// Define the props interface for LoginScreen
interface LoginScreenProps {
  onLogin: (token: string) => void;
  // Now 'school' state will store the _id of the selected school
  school: string; 
  setSchool: (schoolId: string) => void; // setSchool now expects an _id
  username: string;
  setUsername: (username: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loginError: string;
  setLoginError: (error: string) => void;
  theme: 'light' | 'dark';
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, school, setSchool, username, setUsername, password, setPassword, loginError, setLoginError, theme }) => {
  const [availableSchools, setAvailableSchools] = useState<SchoolEntity[]>([]);
  const [loadingSchools, setLoadingSchools] = useState<boolean>(true);
  const [schoolsError, setSchoolsError] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  useEffect(() => {
    const fetchSchools = async () => {
      setLoadingSchools(true);
      setSchoolsError('');
      try {
        const response = await fetch(entitiesUrl);

        if (!response.ok) {
          throw new Error(`Error!: ${response.status}`);
        }
        const data: SchoolEntity[] = await response.json();
        if (Array.isArray(data)) {
          setAvailableSchools(data);
        } else {
          setSchoolsError('Unexpeced API response format for schools. Expected an array of objects.');
        }
      } catch (error: any) {
        setSchoolsError(`Failed to load schools: ${error.message}`);
      } finally {
        setLoadingSchools(false);
      }
    };
    fetchSchools();
  }, []);

  const handleLoginAttempt = async () => {
    if (!school || !username || !password) {
      setLoginError('All fields are required.');
      Toast.show({
        type: 'error',
        text1: 'Login Error',
        text2: 'All fields are required.',
      });
      return;
    }

    setIsAuthenticating(true);
    setLoginError('');
    try {
      const response= await post(loginUrl,username,password,school);
      const data = await response.json();

      if (response.ok) {
        if (data.access_token && data.user) {
          // Create a user data object with all the required information
          const userProfile = {
            _id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            contact: data.user.contact,
            grade: data.user.grade,
            entity_info: {
              _id: data.user.entity_info._id,
              name: data.user.entity_info.name,
            },
          };

          // Save the access token and the user profile as JSON
          try {
            await AsyncStorage.setItem('accessToken', data.access_token);
            await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));
          } catch (storageError) {
            console.error('Error saving data to AsyncStorage:', storageError);
          }
          onLogin(data.access_token); // Pass the token to the parent
          Toast.show({
            type: 'success',
            text1: 'Login Successful',
            text2: 'Welcome to ShikshaGPT!',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Login Error',
            text2: 'Login successful, but no access token or user data received.',
          });
        }
      } else {
        let errorMessage = 'Invalid credentials or an unknown error occurred.';
        if (data.detail) {
          if (Array.isArray(data.detail) && data.detail.length > 0) {
            if (data.detail[0] && typeof data.detail[0] === 'object' && data.detail[0].msg) {
              errorMessage = data.detail[0].msg;
            } else {
              errorMessage = JSON.stringify(data.detail[0]);
            }
          } else if (typeof data.detail === 'string') {
            errorMessage = data.detail;
          } else if (typeof data.detail === 'object' && data.detail !== null) {
            errorMessage = (data.detail.msg || (data.detail as any).message || JSON.stringify(data.detail));
          }
        } else if (data.message && typeof data.message === 'string') {
          errorMessage = data.message;
        } else {
          errorMessage = JSON.stringify(data);
        }

        setLoginError(errorMessage);
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: errorMessage,
        });
      }
    } catch (error: any) {
      setLoginError(`Could not connect to the server: ${error.message}`);
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: `Could not connect to the server: ${error.message}`,
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

 

  return (
    <View style={[styles.flex1  , styles.loginContainer, theme === 'dark' ? styles.darkBg : styles.lightBg]}>
      {/* <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme === 'dark' ? '#151515ff' : '#F3F4F6'} /> */}
      <View style={[styles.loginCard, theme === 'dark' ? styles.darkCard : styles.lightCard]}>
        <Text style={[styles.welcomeText, { color: theme === 'dark' ? '#6f9aeaff' : '#153166' }]}>Welcome Back!</Text>
        <View style={styles.formGroup}>
          <Text style={[styles.label, theme === 'dark' ? styles.gray300Text : styles.gray700Text]}>Select Your School</Text>
          {loadingSchools ? (
            <ActivityIndicator size="small" color={theme === 'dark' ? '#153166' : '#153166'} />
          ) : schoolsError ? (
            <Text style={styles.errorText}>{schoolsError}</Text>
          ) : (
            <View style={[styles.pickerContainer, theme === 'dark' ? styles.darkInputBg : styles.lightInputBg]}>
              <Picker
                selectedValue={school}
                onValueChange={(itemValue: string) => setSchool(itemValue)}
                style={[styles.picker, theme === 'dark' ? styles.darkText : styles.lightText]}
                itemStyle={theme === 'dark' ? styles.darkText : styles.lightText}
              >
                <Picker.Item label="Choose a school" value="" />
                {availableSchools.map((s: SchoolEntity) => (
                  <Picker.Item key={s._id} label={s.name} value={s._id} />
                ))}
              </Picker>
            </View>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, theme === 'dark' ? styles.gray300Text : styles.gray700Text]}>Username</Text>
          <TextInput
            style={[styles.input, theme === 'dark' ? styles.darkInputBg : styles.lightInputBg, theme === 'dark' ? styles.darkText : styles.lightText]}
            placeholder="Enter your username"
            placeholderTextColor={theme === 'dark' ? '#9ca3af' : '#6b7280'}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, theme === 'dark' ? styles.gray300Text : styles.gray700Text]}>Password</Text>
          <TextInput
            style={[styles.input, theme === 'dark' ? styles.darkInputBg : styles.lightInputBg, theme === 'dark' ? styles.darkText : styles.lightText]}
            placeholder="Enter your password"
            placeholderTextColor={theme === 'dark' ? '#9ca3af' : '#6b7280'}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity onPress={handleLoginAttempt} style={styles.loginButton} disabled={isAuthenticating || loadingSchools}>
          {isAuthenticating ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.loginButtonText}>Log In</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
 const styles = StyleSheet.create({
    flex1: {
      flex: 1,
    },
    lightBg: {
      backgroundColor: '#F3F4F6',
    },
    darkBg: {
      backgroundColor: '#151515ff',
    },
    lightCard: {
      backgroundColor: '#FFFFFF',
    },
    darkCard: {
      backgroundColor: '#3b3c3dff',
    },
    lightInputBg: {
      backgroundColor: '#F9FAFB',
      borderColor: '#D1D5DB',
    },
    darkInputBg: {
      backgroundColor: '#717476ff',
      borderColor: '#4B5563',
    },
    lightText: {
      color: '#1F2937',
    },
    darkText: {
      color: '#F9FAFB',
    },
    gray300Text: {
      color: '#D1D5DB',
    },
    gray700Text: {
      color: '#374151',
    },
    loginContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    loginCard: {
      width: '100%',
      maxWidth: 400,
      borderRadius: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 10,
      padding: 32,
      alignItems: 'center',
    },
    welcomeText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 24,
    },
    formGroup: {
      width: '100%',
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 8,
    },
    pickerContainer: {
      borderRadius: 9999,
      borderWidth: 1,
      borderColor: '#D1D5DB',
      overflow: 'hidden',
    },
    picker: {
      height: 50,
      width: '100%',
    },
    input: {
      width: '100%',
      padding: 12,
      borderWidth: 1,
      borderColor: '#D1D5DB',
      borderRadius: 9999,
    },
    errorText: {
      color: '#EF4444',
      fontSize: 14,
      textAlign: 'center',
      marginTop: -10,
      marginBottom: 10,
    },
    loginButton: {
      width: '100%',
      padding: 12,
      borderRadius: 9999,
      backgroundColor: '#4e44ddff',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
    },
    loginButtonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });

export default LoginScreen;
