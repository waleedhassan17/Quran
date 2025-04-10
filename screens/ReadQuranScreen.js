import React, { useState, useRef, useCallback } from 'react';
import {
    StyleSheet, Text, View, FlatList, RefreshControl,
    ActivityIndicator, TouchableOpacity, TextInput, Alert
} from 'react-native';

const englishData = require('./english.json');
const urduData = require('./urdu.json');

const ReadQuranScreen = () => {
    const itemsPerPage = 10;
    const totalAyahs = englishData.length;
    const totalPages = Math.ceil(totalAyahs / itemsPerPage);

    const [currentPage, setCurrentPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [ayahNumber, setAyahNumber] = useState('');

    const flatListRef = useRef(null);

    // Get paginated and merged data
    const getPaginatedData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const englishSlice = englishData.slice(startIndex, endIndex);
        const urduSlice = urduData.slice(startIndex, endIndex);

        return englishSlice.map((item, idx) => ({
            ...item,
            UrduTranslation: urduSlice[idx]?.Translation,
            UrduTafseer: urduSlice[idx]?.Tafseer,
        }));
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setCurrentPage(1);
            setRefreshing(false);
        }, 1000);
    }, []);

    const loadMoreData = useCallback(() => {
        if (loadingMore || currentPage >= totalPages) return;
        setLoadingMore(true);
        setTimeout(() => {
            setCurrentPage(prev => prev + 1);
            setLoadingMore(false);
        }, 1000);
    }, [currentPage, loadingMore]);

    const scrollToAyah = () => {
        const index = parseInt(ayahNumber) - 1;
        if (isNaN(index) || index < 0 || index >= totalAyahs) {
            Alert.alert("Invalid Ayah", "Please enter a valid Ayah number.");
            return;
        }
        try {
            flatListRef.current?.scrollToIndex({ index, animated: true });
        } catch (error) {
            Alert.alert("Ayah Not Found", "This Ayah is not loaded yet. Scroll down to load more.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Ayah Number"
                    placeholderTextColor="#aaa"
                    keyboardType="numeric"
                    value={ayahNumber}
                    onChangeText={setAyahNumber}
                />
                <TouchableOpacity onPress={scrollToAyah} style={styles.goButton}>
                    <Text style={styles.buttonText}>Go</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                ref={flatListRef}
                data={getPaginatedData()}
                renderItem={({ item }) => <Item item={item} />}
                keyExtractor={item => item.Id.toString()}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                onEndReached={loadMoreData}
                onEndReachedThreshold={0.1}
                ListFooterComponent={() => loadingMore && <ActivityIndicator size="large" color="#fff" />}
                getItemLayout={(data, index) => ({ length: 100, offset: 100 * index, index })}
            />

            <View style={styles.paginationContainer}>
                <TouchableOpacity
                    onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    style={[styles.button, currentPage === 1 && styles.disabledButton]}
                >
                    <Text style={styles.buttonText}>Previous</Text>
                </TouchableOpacity>
                <Text style={styles.pageText}>Page {currentPage} of {totalPages}</Text>
                <TouchableOpacity
                    onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    style={[styles.button, currentPage === totalPages && styles.disabledButton]}
                >
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const Item = ({ item }) => {
    return (
        <View style={styles.itemContainer}>
            <View style={styles.rowContainer}>
                <View style={styles.translation}>
                    <Text style={styles.translationText}>EN: {item.Translation}</Text>
                    <Text style={styles.translationText}>UR: {item.UrduTranslation}</Text>
                </View>
                <View style={styles.arabic}>
                    <Text style={styles.arabicText}>{item.AyahTextMuhammadi}</Text>
                </View>
            </View>
            <View style={styles.divider}>
                <Text style={styles.dividerText}>
                    پارہ {item.ParahNumber} سورة رکوع {item.SurahNumber}
                </Text>
            </View>
            <View style={styles.tafseerContainer}>
                <Text style={styles.tafseerText}>EN: {item.Tafseer}</Text>
                <Text style={styles.tafseerText}>UR: {item.UrduTafseer}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333',
        padding: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 40,
        backgroundColor: '#555',
        color: '#fff',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    goButton: {
        marginLeft: 10,
        padding: 10,
        backgroundColor: '#007AFF',
        borderRadius: 5,
    },
    itemContainer: {
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#444',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    translation: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 10,
    },
    arabic: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'flex-end',
        padding: 10,
    },
    divider: {
        backgroundColor: '#666',
        padding: 5,
        alignItems: 'center',
        marginVertical: 5,
    },
    tafseerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    translationText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'left',
    },
    arabicText: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'right',
        fontFamily: 'Amiri',
    },
    dividerText: {
        color: '#fff',
        fontSize: 15,
    },
    tafseerText: {
        color: '#ccc',
        fontSize: 15,
        textAlign: 'center',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    button: {
        padding: 10,
        backgroundColor: '#555',
        borderRadius: 5,
    },
    disabledButton: {
        backgroundColor: '#777',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    pageText: {
        color: '#fff',
        fontSize: 16,
    }
});

export default ReadQuranScreen;
