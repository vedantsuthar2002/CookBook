import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RecipeDetailsScreen from '../Tab/RecipeDetailsScreen';
import TabNavigatorScreen from './TabNavigatorScreen';
import SplashScreen from '../AuthScreens/SplashScreen';
import SignNavigation from './SignNavigation';

const Stack = createNativeStackNavigator();

const MainNavigater = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name='SplashScreen' component={SplashScreen} />
                <Stack.Screen name='tab' component={TabNavigatorScreen} options={{ animation: 'ios' }} />
                <Stack.Screen name='RecipeDetails' component={RecipeDetailsScreen} options={{ animation: 'ios' }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainNavigater