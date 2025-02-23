import React, { useState } from 'react';
import { SafeAreaView, StatusBar, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { AudioRecorder } from './src/components/AudioRecordPlayer';

function App(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        flex: 1,
    };

    return (
        <>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <SafeAreaView style={backgroundStyle}>
                <View style={{ flex: 1, backgroundColor: isDarkMode ? Colors.black : Colors.white }}>
                    <AudioRecorder />
                </View>
            </SafeAreaView>
        </>
    );
}

export default App;
