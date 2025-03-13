// src/components/screens/menu-screen/style.ts

import { StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center', 
    padding: 10,
    backgroundColor: 'rgb(0, 17, 63)', 
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: '30%',
    width: '100%',
  },
  header_text: {
    color: 'rgb(255, 255, 255)',
    fontSize: 16,
  },
  message: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '30%',
    width:'100%',
  },
  message_text: {
    fontWeight: '800',
    fontSize: 30,
    textAlign: 'left',
    color: 'rgba(148, 147, 147, 0.54)',
    width: '60%',
  },
  message_text_span: {
    color: 'rgb(255, 255, 255)',
  },
  container_content: {
    flexDirection: 'column',
    justifyContent: 'center', 
    alignItems: 'center', 
    width: '100%',
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    marginBottom: 20, 
  },
  button: {
    width: '60%',
    padding: 15,
    marginVertical: 10, 
    backgroundColor: 'rgb(255, 255, 255)', 
    borderRadius: 5, 
  },
  buttonText: {
    textAlign: 'center',
    color: 'rgb(10, 0, 100)',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default styles;
