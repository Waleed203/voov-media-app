import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Linking, Alert} from 'react-native';
import AppHeader from '../../components/AppHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {APP_CONSTANTS} from '../../config/constants';
import {useTheme} from '../../context/ThemeContext';
import useGlobalFunctions from '../../services/GlobalService';
import useAPIService from '../../services/APIService';

const Settings = () => {
    const navigation = useNavigation();
    const {theme, toggleTheme} = useTheme();
    const {get, showToast, remove, set} = useGlobalFunctions();
    const [menuItems, setMenuItems] = useState([]);
    let currenTheme = useRef(theme);
    const {sendRequest} = useAPIService();

    useEffect(() => {
        populateMenuItems();
    }, []);

    const handleToggleTheme = async () => {
        const nextMode = theme.mode === 'light' ? 'dark' : 'light';
        console.log("Select Theme =", theme, currenTheme.current);

        currenTheme.current.mode = nextMode;
        toggleTheme(nextMode);
    };

    const populateMenuItems = async () => {
        const token = await get(APP_CONSTANTS.STORAGE_KEYS.TOKEN);
        console.log('token from storage = ', token)
        if (!token) {
            setMenuItems([
                {id: "1", icon: "moon", label: "Toggle Theme", action: handleToggleTheme, showArrow: false},
                {id: "4", icon: "clipboard", label: "Privacy Policy", action: () => policyOrTerms('policy')},
                {id: "5", icon: "clipboard", label: "Term's & Conditions", action: () => policyOrTerms('terms')},
                {id: "6", icon: "mail", label: "Support", action: () => policyOrTerms('support')},
            ]);
        } else {
            setMenuItems([
                {id: "1", icon: "moon", label: "Toggle Theme", action: handleToggleTheme, showArrow: false},
                {id: "2", icon: "clipboard", label: "Contact Us", action: () => contact()},
                {id: "3", icon: "clipboard", label: "Delete Account", action: () => deleteAcc()},
                {id: "4", icon: "clipboard", label: "Privacy Policy", action: () => policyOrTerms('policy')},
                {id: "5", icon: "clipboard", label: "Term's & Conditions", action: () => policyOrTerms('terms')},
                {id: "6", icon: "mail", label: "Support", action: () => policyOrTerms('support')},
                {id: "7", icon: "log-out-outline", label: "Logout", action: () => logout()},
            ]);
        }
    }

    const contact = async () => {
        console.log("contact us");
        const token = await get(APP_CONSTANTS.STORAGE_KEYS.TOKEN);
        console.log('token from storage = ', token)
        if (!token) {
            showToast("Please login first to contact");
            return;
        }
        navigation.navigate('ContactUs');
    }

    const deleteAccount = async () => {
        try {
            const params = {};
            const response = await sendRequest('disabled_account', params, 'POST', true);
            return response;
        } catch (error) {
            console.error('Error deleting user video:', error);
        }
    }

    const deleteAcc = async () => {
        console.log("Delete Account");
        const token = await get(APP_CONSTANTS.STORAGE_KEYS.TOKEN);
        console.log('token from storage = ', token)
        if (!token) {
            showToast("Please login first to delete account");
            return;
        }

        Alert.alert(
            'Delete your Account',
            'Do you want to delete your account?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Confirm',
                    onPress: async () => {
                        try {
                            const res = await deleteAccount();
                            console.log('delete res = ', res);
                            if (res.status == 200) {
                                showToast("Account deleted successfully!");
                                await remove(APP_CONSTANTS.STORAGE_KEYS.TOKEN);
                                await remove(APP_CONSTANTS.STORAGE_KEYS.UID);
                                await remove(APP_CONSTANTS.STORAGE_KEYS.USER_DATA);
                                navigation.reset({
                                    index: 0,
                                    routes: [{name: 'Login'}],
                                });
                            }
                        } catch (err) {
                            console.log('Error deleting video:', err);
                        }
                    },
                },
            ],
            {cancelable: true}
        );
    }

    const policyOrTerms = (type) => {
        if (type == 'policy') {
            Linking.openURL('https://voovmedia.com/privacy-policy/');
        } else if (type == 'terms') {
            Linking.openURL('https://voovmedia.com/terms-and-conditions/');
        } else if (type == 'support') {
            Linking.openURL('https://voovmedia.com/#contact');
        }
    }

    const logout = async () => {
        console.log('logging out');
        await remove(APP_CONSTANTS.STORAGE_KEYS.TOKEN);
        await remove(APP_CONSTANTS.STORAGE_KEYS.UID);
        await remove(APP_CONSTANTS.STORAGE_KEYS.USER_DATA);

        navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
        });
    }

    return (
        <View style={[styles.container, {backgroundColor: theme.background}]}>
            <AppHeader title="Settings" showBack={true} goBack={navigation.goBack}/>
            <FlatList
                data={menuItems}
                renderItem={({item}) => (
                    <TouchableOpacity style={styles.item} onPress={item.action}>
                        <Ionicons name={item.icon} size={22} color={theme.primary}/>
                        <Text style={[styles.label, {color: theme.text}]}>{item.label}</Text>
                        {item.showArrow && <Ionicons name="chevron-forward" size={18} color={theme.text}/>}
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        paddingVertical: 10,

    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 20,
        // borderBottomWidth: 0.3,
        // borderBottomColor: "#333",
        paddingHorizontal: 20
    },
    label: {
        flex: 1,
        fontSize: 16,
        color: "#fff",
        marginLeft: 20,
    },
});

export default Settings; 