
// SplashScreen.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

// Define the props interface for SplashScreen
// The theme prop is an object containing the color palette, not a string.
interface SplashScreenProps {
  theme: {
    background: string;
    text: string;
    primary: string;
    card: string;
  };
}

const SplashScreen: React.FC<SplashScreenProps> = ({ theme }) => {
  const styles = StyleSheet.create({
    flex1: {
      flex: 1,
    },
    splashContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    splashContent: {
      alignItems: 'center',
    },
    splashLogo: {
      width: 192,
      height: 192,
      marginBottom: 24,
    },
    splashTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      letterSpacing: 1,
    },
    splashSubtitle: {
      fontSize: 16,
      color: theme.text,
      marginTop: 8,
    },
  });

  return (
    <View style={[styles.flex1, styles.splashContainer]}>
      
      <View style={styles.splashContent}>
        {/* Placeholder image used for demonstration purposes */}
        <Image
          source={require('../assets/icon.png')}
          style={styles.splashLogo}
        />
        <Text style={styles.splashTitle}>ShikshaGPT</Text>
        <Text style={styles.splashSubtitle}>Your AI Tutor</Text>
      </View>
    </View>
  );
};

export default SplashScreen;
