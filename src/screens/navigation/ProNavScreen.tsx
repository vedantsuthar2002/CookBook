import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../Tab/ProfileScreen';
const Stack = createStackNavigator();

const ProNavScreen: React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="profile" component={ProfileScreen} />
        </Stack.Navigator>
    );
};

export default ProNavScreen;