import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, StatusBar, TextInput, FlatList, ListRenderItem, ActivityIndicator, ScrollView } from 'react-native';
import Emoji from 'react-native-emoji';
import apiService from '../../API/apiService';
import { useNavigation } from '@react-navigation/native';
import RecipeDetails from './RecipeDetailsScreen';

interface Meal {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strCategory: string;
}

interface Category {
    idCategory: string;
    strCategory: string;
    strCategoryThumb: string;
    strCategoryDescription: string;
}

const HomeScreen: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Meal[]>([]);
    const [originalResults, setOriginalResults] = useState<Meal[]>([]);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [randomRecipes, setRandomRecipes] = useState<Meal[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [filteredRecipes, setFilteredRecipes] = useState<Meal[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const dropdownRef = useRef<View>(null);
    const navigation = useNavigation();

    useEffect(() => {
        if (searchTerm === '') {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        const filteredResults = originalResults.filter((meal) =>
            meal.strMeal.toLowerCase().startsWith(searchTerm.toLowerCase())
        );
        setSearchResults(filteredResults);
        setShowDropdown(true);
    }, [searchTerm, originalResults]);

    useEffect(() => {
        if (dropdownRef.current) {
            const height = 91 * searchResults.length;
            dropdownRef.current.setNativeProps({
                style: { height: height > 533 ? 533 : height }
            });
        }
    }, [searchResults]);

    useEffect(() => {
        const fetchRandomRecipes = async () => {
            try {
                setLoading(true);
                const response = await apiService.lookupRandomMeal();
                const recipes = response.meals || [];
                setRandomRecipes(recipes);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching random recipes:', error);
                setLoading(false);
            }
        };

        fetchRandomRecipes();
    }, []);


    const searchMealByName = async (name: string) => {
        setSearchTerm(name);
        setShowDropdown(true);

        try {
            setLoading(true);
            const firstLetter = name.charAt(0);
            const response = await apiService.listMealsByFirstLetter(firstLetter);
            const meals = response.meals || [];
            setOriginalResults(meals);
            setSearchResults(meals);
            setLoading(false);
        } catch (error) {
            console.error('Error searching meal by name:', error);
            setLoading(false);
        }
    };

    const handleDropdownPress = (item: Meal) => {
        navigation.navigate('RecipeDetails', { idMeal: item.idMeal });
    };

    const handleRandomRecipePress = (item: Meal) => {
        navigation.navigate('RecipeDetails', { idMeal: item.idMeal });
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiService.listMealCategories();
                const categoriesData = response.categories || [];
                setCategories(categoriesData);

                if (categoriesData.length > 0) {
                    handleCategoryPress(categoriesData[0].strCategory)
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryPress = async (category: string) => {
        try {
            const response = await apiService.filterByCategory(category);
            const meals = response.meals || [];
            setFilteredRecipes(meals);
            setSelectedCategory(category);
        } catch (error) {
            console.error('Error fetching recipes by category:', error);
        }
    };

    return (
        <View style={styles.root}>
            <StatusBar barStyle="dark-content" backgroundColor='#FFF' />
            <ScrollView
                showsVerticalScrollIndicator={!showDropdown && showDropdown}
                contentContainerStyle={styles.scrollViewContainer}
                scrollEnabled={!showDropdown}
            >
                <View>
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <Image source={require('../../assets/images/user.png')} style={styles.userPhoto} />
                            <View style={styles.greetingContainer}>
                                <Text style={styles.welcomeText}>Welcome,<Emoji name='star-struck' /></Text>
                                <Text style={styles.greetingText}>Vedant</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.headerRight} onPress={() => { }}>
                            <Image source={require('../../assets/notification.png')} style={styles.notificationIcon} />
                        </TouchableOpacity>
                    </View>
                    {/* search Input */}
                    <View style={styles.search}>
                        <TextInput
                            placeholder='Type Recipe...'
                            placeholderTextColor='#9CA3AF'
                            style={styles.searchinput}
                            value={searchTerm}
                            onChangeText={searchMealByName}
                        />
                        <Image source={require('../../assets/loupe.png')} style={styles.searchlogo} />
                    </View>
                    {/* Display search results */}
                    {showDropdown && (
                        <View ref={dropdownRef} style={[styles.dropdownContainer, loading && styles.dropdownContainerOpacity]}>
                            {loading ? (
                                <ActivityIndicator size="large" color="#0000ff" />
                            ) : (
                                <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                                    {searchResults.map(item => (
                                        <TouchableOpacity key={item.idMeal} style={styles.dropdownItem} activeOpacity={showDropdown ? 1 : 0} onPress={() => handleDropdownPress(item)}>
                                            <Image source={{ uri: item.strMealThumb }} style={styles.mealImage} />
                                            <Text style={styles.mealName}>{item.strMeal}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}
                        </View>
                    )}

                    {/* Random recipes */}
                    <Text style={styles.rendomTitle}> Special Recipe</Text>
                    <View style={styles.randomRecipesList}>
                        {loading ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            randomRecipes.map((item) => (
                                <TouchableOpacity
                                    key={item.idMeal}
                                    style={styles.randomRecipeItemContainer}
                                    onPress={() => handleRandomRecipePress(item)}
                                    activeOpacity={showDropdown ? 1 : 0}
                                >
                                    <Image source={{ uri: item.strMealThumb }} style={styles.randomRecipeImage} />
                                    <View style={styles.randomRecipeDetails}>
                                        <Text style={styles.recipeName}>{item.strMeal}</Text>
                                        <View style={styles.recipeInfo}>
                                            <Text style={styles.recipeInfoText}>Portion: 4</Text>
                                            <Text style={styles.recipeInfoText}><Emoji name='clock330' />: 30 mins</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>

                    {/* Horizontal ScrollView for categories */}
                    {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.CategoryScrollViewStyle}
                            scrollEnabled={!showDropdown}
                        >
                            {categories.map((item) => (
                                <TouchableOpacity
                                    key={item.idCategory}
                                    style={styles.categoryScroll}
                                    activeOpacity={showDropdown ? 1 : 0}
                                    onPress={() => handleCategoryPress(item.strCategory)}
                                >
                                    <Image source={{ uri: item.strCategoryThumb }} style={styles.categoryScrollImage} resizeMode={'stretch'} />
                                    <Text style={styles.categoryScrollText}>{item.strCategory}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                    {/* Display filtered recipes */}
                    {selectedCategory && (
                        <ScrollView contentContainerStyle={styles.filteredRecipesContainer} scrollEnabled={!showDropdown}>
                            {filteredRecipes.map((item, index) => (
                                <TouchableOpacity
                                    key={item.idMeal}
                                    style={[styles.caregotyRecipeItemContainer, index % 2 !== 0 && { marginLeft: 10 }]}
                                    onPress={() => navigation.navigate('RecipeDetails', { idMeal: item.idMeal })}
                                >
                                    <Image source={{ uri: item.strMealThumb }} style={styles.categoryRecipeImage} />
                                    <View style={styles.randomRecipeDetails}>
                                        <Text numberOfLines={2} style={styles.recipeName}>{item.strMeal}</Text>
                                        <View style={styles.recipeInfo}>
                                            <Text style={styles.recipeInfoText}>Portion: 4</Text>
                                            <Text style={styles.recipeInfoText}><Emoji name='clock330' />: 30 mins</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}


                </View>
            </ScrollView>
        </View >
    );
};

const styles = StyleSheet.create({
    scrollViewContainer: {
        flexGrow: 1,
    },
    root: {
        backgroundColor: '#FFF',
        flex: 1,
        padding: 20,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerRight: {
        justifyContent: 'center',
    },
    userPhoto: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    welcomeText: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 18,
        color: '#9CA3AF',
    },
    greetingText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0F172A',
        lineHeight: 24,
        marginLeft: 3
    },
    greetingContainer: {
        justifyContent: 'center'
    },
    notificationIcon: {
        height: 24,
        width: 24
    },
    search: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginVertical: 20,
        width: '100%',
        alignItems: 'center',
    },
    searchinput: {
        backgroundColor: '#F3F4F6',
        padding: 16,
        borderRadius: 8,
        height: 53,
        width: '100%',
    },
    touchsearch: {
        position: 'absolute',
        padding: 16,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchlogo: {
        right: 35,
        position: 'relative',
        height: 20,
        width: 20,
        alignItems: "center",
    },
    flatList: {
        marginTop: 20,
    },
    mealItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    mealImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    mealName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#0F172A',
    },
    dropdownContainer: {
        position: 'absolute',
        top: 130,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        zIndex: 1,
        maxHeight: 600,
    },
    dropdownContainerOpacity: {
        opacity: 0.5,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F4F5F6',
    },
    rendomTitle: {
        fontSize: 18,
        color: '#000',
        fontWeight: '600',
    },
    randomRecipesList: {
        marginTop: 10,
        paddingHorizontal: 5,
        backgroundColor: '#F4F5F6',
        borderRadius: 10
    },
    randomRecipeItemContainer: {
        flexDirection: 'row',
        width: '50%',
        paddingVertical: 5,

    },
    randomRecipeImage: {
        width: '95%',
        aspectRatio: 4 / 3,
        borderRadius: 10,
        margin: 10
    },
    randomRecipeDetails: {
        marginVertical: 10,
        paddingHorizontal: 5,
    },
    recipeName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    recipeInfo: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    recipeInfoText: {
        fontSize: 14,
    },
    scrollView: {
        maxHeight: 600,
    },
    CategoryScrollViewStyle: {
        height: 75,
        marginVertical: 0,
    },
    categoryScroll: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
    },
    categoryScrollImage: {
        width: 100,
        height: 35,
        alignItems: 'center',
        borderRadius: 20
    },
    categoryScrollText: {
        textAlign: 'center',
        position: 'absolute',
        backgroundColor: 'rgba(00, 00, 00, 0.30)',
        width: '100%',

        color: '#FFF',
        borderRadius: 20,
        paddingVertical: 8,
    },
    filteredRecipesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginTop: 10,
    },

    caregotyRecipeItemContainer: {
        width: '48%',
        marginBottom: 10,
    },
    categoryRecipeImage: {
        width: '95%',
        aspectRatio: 3 / 4,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        left: 3,
        top: 3,
    },
});

export default HomeScreen;
