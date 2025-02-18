import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    setTimeout(() => {
      setLoading(false);
      onFinish(); 
    }, 3000);
  }, []);

  if (!loading) return null; 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SleepAir</Text>
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4A90E2', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
});

export { SplashScreen };
