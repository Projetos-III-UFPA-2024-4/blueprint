// src/components/screens/screen1/style.ts

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        height: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'rgb(3, 7, 68)',
    },
    container_resultado: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '95%',
        borderRadius: 10,
        boxShadow: '0 0 5 2 rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(83, 83, 83, 0.3)',
        paddingTop: 40,
        paddingBottom: 40,
    },
    resultado: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '900',
        color: 'rgb(255, 255, 255)',
    },
    file_info: {
        display: 'flex',
        alignItems: 'flex-start',
    },
    file_info_text: {
        color: 'rgb(255, 255, 255)',
        textAlign: 'left',
    },
    container_aviso: {
        display: 'flex',
        backgroundColor: 'rgba(83, 83, 83, 0.3)',
        alignItems: 'center',
        marginTop: 20,
        boxShadow: '0 0 5 2 rgba(255, 255, 255, 0.2)',
        borderRadius: 10,
        padding: 5,
        width: '95%',
    },
    aviso: {
        fontSize: 16,
        color: 'rgb(255, 255, 255)',
        marginTop: 10,
        textAlign: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'rgb(255, 255, 255)',
        marginBottom: 20,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        marginTop: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#000',
        marginTop: 10,
    },
    chartContainer: {
        display: 'flex',
        backgroundColor: 'rgba(83, 83, 83, 0.3)',
        alignItems: 'center',
        marginTop: 20,
        boxShadow: '0 0 5 2 rgba(255, 255, 255, 0.2)',
        borderRadius: 10,
        padding: 20,
        width: '95%',
    },
    chartText: {
        fontSize: 18,
        color: 'rgb(255, 255, 255)',
        marginBottom: 10,
    },
});

export default styles;
