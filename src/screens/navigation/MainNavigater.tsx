import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RecipeDetailsScreen from '../Tab/RecipeDetailsScreen';
import TabNavigatorScreen from './TabNavigatorScreen';

const Stack = createNativeStackNavigator();

const MainNavigater = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name='tab' component={TabNavigatorScreen} options={{ animation: 'ios' }}></Stack.Screen>
                <Stack.Screen name='RecipeDetails' component={RecipeDetailsScreen} options={{ animation: 'ios' }}></Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainNavigater