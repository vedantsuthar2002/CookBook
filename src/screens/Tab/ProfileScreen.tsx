import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import CustomButton from '../../components/CustomButton';

const ProfileScreen = () => {
    const handleEditProfile = () => {
        // Logic for editing profile
        console.log('Editing profile');
    };

    const handleLogout = () => {
        // Logic for logging out
        console.log('Logging out');
    };

    const handleSetting = () => {
        console.log('Setting');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.heading}>Profile</Text>
                <TouchableOpacity onPress={handleSetting}>
                    <Image source={require('../../assets/settings.png')} style={styles.notificationIcon} />
                </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
                <View style={styles.propic}>
                    <Image
                        source={require('../../assets/images/user.png')} // Placeholder image URL
                        style={styles.profileImage}
                    />
                    <View style={styles.Details}>
                        <View style={styles.ulstyle}>
                            <Text style={styles.upper}>29</Text>
                            <Text style={styles.lower}>Recipes</Text>
                        </View>
                        <View style={styles.ulstyle}>
                            <Text style={styles.upper}>144</Text>
                            <Text style={styles.lower}>Followers</Text>
                        </View>
                        <View style={styles.ulstyle}>
                            <Text style={styles.upper}>306</Text>
                            <Text style={styles.lower}>Following</Text>
                        </View>
                    </View>
                </View>
                <Text style={styles.value}>Vedant</Text>
                <CustomButton text={'Manage Profile'} type={'TERTIARY'} bgColor={'#FFF5E6'} fgColor={'#FB9400'} onPress={handleEditProfile} />
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    heading: {
        color: '#0F172A',
        fontSize: 18,
        fontWeight: '600',
        paddingVertical: 10,
        paddingLeft: 5,
    },
    editButton: {
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    editButtonText: {
        color: '#ffffff',
        fontSize: 16,
    },
    profileInfo: {
        marginBottom: 20,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 10,
    },
    propic: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    Details: {
        flexDirection: 'row',
        width: '75%',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    value: {
        color: '#0F172A',
        fontWeight: '600',
        fontSize: 16,
        marginBottom: 15,
        paddingLeft: 10,
    },
    logoutButton: {
        padding: 15,
        backgroundColor: '#dc3545',
        borderRadius: 5,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#ffffff',
        fontSize: 16,
    },
    notificationIcon: {
        height: 24,
        width: 24
    },
    ulstyle: {
    },
    upper: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0F172A',
        alignSelf: 'center',
    },
    lower: {
        fontSize: 14,
        fontWeight: '400',
        color: '#9CA3AF',
    },
});

export default ProfileScreen;
