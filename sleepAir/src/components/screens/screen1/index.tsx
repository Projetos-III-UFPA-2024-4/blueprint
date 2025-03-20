import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ViewBase } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import styles from './style';

const Screen1 = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://192.168.1.185:5179/listar_audio_recente');
                if (!response.ok) {
                    throw new Error('Erro na requisição');
                }
                const result = await response.json();
                setData(result);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Carregando dados...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Erro: {error}</Text>
            </View>
        );
    }

    const percentRonco = data?.percent_ronco ? parseFloat(data.percent_ronco) : 0;

    const pieData = [
        {
            name: "Saudável",
            population: 100 - percentRonco,
            color: "#00FF00",
            legendFontColor: "#ffffff",
            legendFontSize: 14,
        },
        {
            name: "Não Saudável",
            population: percentRonco,
            color: "#FF0000",
            legendFontColor: "#ffffff",
            legendFontSize: 14,
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.container_resultado}>
                <Text style={{ color: 'rgb(207, 207, 207)', fontSize: 24, fontWeight: '800', marginBottom: 20 }}>Resultado:</Text>
                <Text
                    style={[
                        styles.resultado,
                        {
                            color: data?.resultado === "Sono possivelmente saudável." ? "#00FF00" : "#FF0000ed"
                        }
                    ]}
                >
                    {data?.resultado}
                </Text>
            </View>
            <View style={styles.chartContainer}>
                <Text style={styles.chartText}>Percentual de Ronco</Text>
                <PieChart
                    data={pieData}
                    width={350}
                    height={200}
                    chartConfig={{
                        backgroundColor: "#ffffff",
                        backgroundGradientFrom: "#ffffff",
                        backgroundGradientTo: "#ffffff",
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            marginVertical: 10,
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726",
                        },
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="0"
                />
                <View style={styles.file_info}>
                    <Text style={styles.file_info_text}>Arquivo de áudio analisado</Text>
                    <Text style={styles.file_info_text}>ID: {data?.id}</Text>
                    <Text style={styles.file_info_text}>Nome: {data?.name}</Text>
                </View>
            </View>
            <View>
                {data?.resultado === "Sono possivelmente não saudável." && (
                    <View style={styles.container_aviso}>
                        <Text style={styles.aviso}>
                            Notamos que seu padrão de sono pode estar apresentando algumas irregularidades.
                            Para cuidar melhor da sua saúde e bem-estar, sugerimos que você consulte um especialista em sono.
                        </Text>
                        <Text style={styles.aviso}>
                            Uma avaliação profissional pode fornecer orientações valiosas para melhorar a qualidade do seu descanso.
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default Screen1;
