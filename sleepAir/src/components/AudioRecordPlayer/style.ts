import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: 20,
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)', 
  },

  title: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'rgb(5, 71, 252)'
  },

  button: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(1, 1, 1, 1)',
    marginVertical: 5,
  },

  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },

  directoryText: {
    alignContent: 'flex-end',
    marginVertical: 10,
    fontSize: 14,
    color: '#555',
  },

  recordButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },

  stopButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },

  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },

  noAudioText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 10,
  },

  audioContainer:{
    flex: 1,
  },

  audioItem: {
    padding: 10,
    backgroundColor: '#e9ecef',
    marginVertical: 5,
    borderRadius: 8,
  },
});
