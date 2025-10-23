import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {useTheme} from "../../../context/ThemeContext";

export default function NotLoggedIn() {
    const navigation = useNavigation();
    const { theme } = useTheme();
    return (
        <View style={[styles.emptyState, {backgroundColor: theme.background}]}>
            <Text style={styles.emoji}>📹</Text>
            <Text style={[styles.emptyText, {color: theme.text}]}>Login to Record and Upload Videos</Text>

            <TouchableOpacity style={styles.editProfileButton} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.editProfileText}>Login Now</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emoji: {
        fontSize: 60,
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 6,
        textAlign: 'center'
    },
    editProfileButton: {
        backgroundColor: "#47c2f0",
        paddingVertical: 10,
        paddingHorizontal: 50,
        borderRadius: 8,
        marginTop: 10,
    },
    editProfileText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
})