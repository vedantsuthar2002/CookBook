// RecipeDetails.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, StatusBar, TouchableOpacity, BackHandler, ToastAndroid } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import apiService from '../../API/apiService';

interface RecipeDetailsProps {
    route: {
        params: {
            idMeal: string;
        };
    };
}

const RecipeDetails: React.FC<RecipeDetailsProps> = ({ route }) => {
    const { idMeal } = route.params;
    const [recipeDetails, setRecipeDetails] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const scrollViewRef = useRef<ScrollView>(null);
    const [scrollPosition, setScrollPosition] = useState<number>(0);
    const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

    useEffect(() => {
        SQLite.openDatabase({ name: 'RecipesDB' }, () => { }, error => {
            console.error('Error opening database:', error);
        });
    }, []);

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            try {
                setLoading(true);
                const response = await apiService.lookupMealById(idMeal);
                const details = response.meals ? response.meals[0] : null;
                setRecipeDetails(details);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching recipe details:', error);
                setLoading(false);
            }
        };

        fetchRecipeDetails();
    }, [idMeal]);

    const checkIfBookmarked = async () => {
        try {
            const db = await SQLite.openDatabase({ name: 'RecipesDB' });
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM FavoriteRecipes WHERE recipeId = ?',
                    [idMeal],
                    (_, { rows }) => {
                        setIsBookmarked(rows.length > 0);
                    },
                    error => console.error('Error executing SQL:', error)
                );
            });
        } catch (error) {
            console.error('Error opening database:', error);
        }
    };

    useEffect(() => {
        checkIfBookmarked();
    }, []);

    const handleScroll = (event: any) => {
        const { y } = event.nativeEvent.contentOffset;
        setScrollPosition(y);
    };

    const handleBookmarkToggle = async () => {
        try {
            const db = await SQLite.openDatabase({ name: 'RecipesDB' });
            db.transaction(tx => {
                tx.executeSql(
                    'CREATE TABLE IF NOT EXISTS FavoriteRecipes (id INTEGER PRIMARY KEY NOT NULL, recipeId TEXT, recipeName TEXT, imageUrl TEXT)',
                    [],
                    () => {
                        if (isBookmarked) {
                            tx.executeSql('DELETE FROM FavoriteRecipes WHERE recipeId = ?', [idMeal]);
                            ToastAndroid.show('Recipe deleted!', ToastAndroid.SHORT);
                        } else {
                            tx.executeSql(
                                'INSERT INTO FavoriteRecipes (recipeId, recipeName, imageUrl) VALUES (?, ?, ?)',
                                [idMeal, recipeDetails.strMeal, recipeDetails.strMealThumb]
                            );
                            ToastAndroid.show('Recipe saved!', ToastAndroid.SHORT);
                        }
                    },
                    error => console.error('Error executing SQL:', error)
                );
            });
            setIsBookmarked(prevState => !prevState);
        } catch (error) {
            console.error('Error opening database:', error);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar
                translucent
                backgroundColor={scrollPosition >= 350 ? '#FFFFFF' : 'transparent'}
                barStyle={'dark-content'}
            />
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : !recipeDetails ? (
                <View style={styles.errorContainer}>
                    <Text>Error fetching recipe details. Please try again later.</Text>
                </View>
            ) : (
                <>
                    <ScrollView
                        ref={scrollViewRef}
                        showsVerticalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >
                        <Image source={{ uri: recipeDetails.strMealThumb }} style={styles.recipeImage} />
                        <View style={styles.recipe}>
                            <Text style={styles.recipeName}>{recipeDetails.strMeal}</Text>
                            <Text style={styles.title}>Category: </Text>
                            <Text style={styles.category}>{recipeDetails.strCategory}</Text>
                            <Text style={styles.title}>Instruction: </Text>
                            <Text style={styles.instructions}>{recipeDetails.strInstructions}</Text>
                        </View>
                        <TouchableOpacity style={styles.touchableImageContainer} onPress={handleBookmarkToggle}>
                            <Image
                                source={require('../../assets/nav/Bookmark.png')}
                                style={[styles.touchableImage, { tintColor: isBookmarked ? '#FB9400' : '#666' }]}
                            />
                        </TouchableOpacity>
                    </ScrollView>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recipeImage: {
        flex: 0.5,
        width: '100%',
        height: 350,
        marginBottom: 10,
    },
    recipe: {
        padding: 24,
    },
    recipeName: {
        fontSize: 18,
        lineHeight: 22,
        color: '#0F172A',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    title: {
        color: '#0F172A',
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 22,
        marginVertical: 10,
    },
    category: {
        fontSize: 14,
        marginBottom: 10,
        color: '#64748B',
        fontWeight: '400',
    },
    instructions: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '400',
    },
    touchableImageContainer: {
        position: 'absolute',
        top: 45,
        right: 20,
        zIndex: 10,
        backgroundColor: '#FFF',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    touchableImage: {
        resizeMode: 'contain',
    },
});

export default RecipeDetails;
