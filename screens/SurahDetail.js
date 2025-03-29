import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const SurahDetail = ({ route }) => {
    const { surahNumber, surahName } = route.params;
    const [ayahs, setAyahs] = useState([]);

    useEffect(() => {
        const fetchSurahDetails = async () => {
            const url = `https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`;
            const response = await fetch(url);
            const jsonData = await response.json();
            setAyahs(jsonData.data.ayahs);
        };

        fetchSurahDetails();
    }, [surahNumber]);

    return (
        <View style={styles.container}>
            <Text style={styles.surahTitle}>{surahName}</Text>
            <FlatList
                data={ayahs}
                renderItem={({ item }) => (
                    <View style={styles.ayahContainer}>
                        <Text style={styles.ayahText}>
                            <Text style={styles.ayahNumber}>{item.numberInSurah}. </Text>
                            {item.text}
                        </Text>
                    </View>
                )}
                keyExtractor={(item) => item.number.toString()}
            />
        </View>
    );
};

export default SurahDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9'
    },
    surahTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333'
    },
    ayahContainer: {
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 5,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    ayahText: {
        fontSize: 18,
        color: '#333',
        textAlign: 'justify'
    },
    ayahNumber: {
        fontWeight: 'bold',
        color: '#007bff'
    }
});
