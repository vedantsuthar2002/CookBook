import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const ProfileScreen = () => {
    const handleEditProfile = () => {
        // Logic for editing profile
        console.log('Editing profile');
    };

    const handleLogout = () => {
        // Logic for logging out
        console.log('Logging out');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.heading}>User Profile</Text>
                <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
                <Image
                    source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder image URL
                    style={styles.profileImage}
                />
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>Vedant</Text>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>vedantsuthar2002@gmail.com</Text>
                <Text style={styles.label}>Bio:</Text>
                <Text style={styles.value}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
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
        fontSize: 24,
        fontWeight: 'bold',
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
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 10,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        marginBottom: 15,
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
});

export default ProfileScreen;
