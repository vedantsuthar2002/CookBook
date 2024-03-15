import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, StatusBar } from 'react-native';
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

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!recipeDetails) {
        return (
            <View style={styles.errorContainer}>
                <Text>Error fetching recipe details. Please try again later.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle={'light-content'} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <Image source={{ uri: recipeDetails.strMealThumb }} style={styles.recipeImage} />
                <Text style={styles.recipeName}>{recipeDetails.strMeal}</Text>
                <Text style={styles.category}>Category: {recipeDetails.strCategory}</Text>
                <Text style={styles.instructions}>{recipeDetails.strInstructions}</Text>
            </ScrollView>
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
    recipeName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    category: {
        fontSize: 16,
        marginBottom: 10,
    },
    instructions: {
        fontSize: 16,
    },
});

export default RecipeDetails;
