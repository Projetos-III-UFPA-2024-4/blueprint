import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaView, StatusBar, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native'; // Importando o NavigationContainer
import { createStackNavigator } from '@react-navigation/stack'; // Importando createStackNavigator
import { AudioRecorder } from './src/components/AudioRecordPlayer/index'; // Importando AudioRecorder
import MenuScreen from './src/components/screens/menu-screen'; // Importando MenuScreen
import Screen1 from './src/components/screens/screen1/index'; // Importando Screen1
import Screen2 from './src/components/screens/screen2/index'; // Importando Screen2

// Definindo o tipo de navegação para o stack
type RootStackParamList = {
    Home: undefined;
    Gravador: undefined;
    Relatório: undefined;
    Histórico: undefined;
};

// Criando o StackNavigator
const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        flex: 1,
    };

    return (
        <NavigationContainer>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={backgroundStyle.backgroundColor} />
            <SafeAreaView style={backgroundStyle}>
                <View style={{ flex: 1, backgroundColor: isDarkMode ? Colors.black : Colors.white }}>
                    <Stack.Navigator initialRouteName="Home">
                        <Stack.Screen name="Home" component={MenuScreen} />
                        <Stack.Screen name="Gravador" component={AudioRecorder} />
                        <Stack.Screen name="Relatório" component={Screen1} />
                        <Stack.Screen name="Histórico" component={Screen2} />
                    </Stack.Navigator>
                </View>
            </SafeAreaView>
        </NavigationContainer>
    );
}

export default App;
