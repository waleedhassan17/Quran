import React, { useEffect, useState } from 'react';
import {
    StyleSheet, Text, View, TextInput,
    FlatList, TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Search = () => {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const navigation = useNavigation();

    const getAPIData = async () => {
        try {
            const url = 'https://api.alquran.cloud/v1/quran/en.asad';
            const result = await fetch(url);
            const jsonData = await result.json();
            const allSurahs = jsonData.data.surahs;

            // ✅ only keep last 10 Surahs (surah 105 to 114)
            const last10Surahs = allSurahs.slice(-10);

            setData(last10Surahs);
        } catch (error) {
            console.error("Failed to fetch Surah data:", error);
        }
    };

    useEffect(() => {
        getAPIData();
    }, []);

    useEffect(() => {
        const filteredSurahs = data.filter(surah => {
            const surahName = `${surah.englishName} ${surah.name}`.toLowerCase();
            return surahName.includes(searchQuery.toLowerCase());
        });
        setFilteredData(filteredSurahs);
    }, [searchQuery, data]);

    const handleSurahClick = (item) => {
        navigation.navigate('SurahDetail', {
            surahNumber: item.number,
            surahName: item.englishName
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchBarContainer}>
                <TextInput
                    style={styles.searchBar}
                    placeholder='Search Last 10 Surahs'
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            <FlatList
                data={searchQuery ? filteredData : data}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleSurahClick(item)}>
                        <View style={styles.itemContainer}>
                            <Text style={styles.itemText}>
                                {item.number}. {item.englishName} ({item.name})
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.number.toString()}
            />
        </View>
    );
};

export default Search;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9'
    },
    searchBarContainer: {
        marginBottom: 20
    },
    searchBar: {
        borderWidth: 2,
        fontSize: 20,
        padding: 10,
        borderRadius: 5
    },
    itemContainer: {
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 5,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    itemText: {
        fontSize: 20,
        color: '#333'
    }
});
