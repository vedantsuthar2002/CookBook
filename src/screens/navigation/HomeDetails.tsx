import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import RecipeDetailsScreen from '../Tab/RecipeDetailsScreen';
import HomeScreen from '../Tab/HomeScreen';

const Stack = createStackNavigator();

const Homestack: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="RecipeDetails" component={RecipeDetailsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Homestack;
