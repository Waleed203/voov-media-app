import React, {createContext, useContext, useState, useEffect} from 'react';
import {Appearance} from 'react-native';
import {lightTheme, darkTheme} from '../theme/theme';
import {APP_CONSTANTS} from '../config/constants';
import useGlobalFunctions from '../services/GlobalService';

const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
    const colorScheme = Appearance.getColorScheme();
    const [theme, setTheme] = useState(colorScheme === 'dark' ? darkTheme : lightTheme);
    const {set, get} = useGlobalFunctions();

    useEffect(() => {
        console.log("theme context use effect");
        getStoredTheme();
    }, []);

    const getStoredTheme = async () => {
        const storedTheme = await get(APP_CONSTANTS.STORAGE_KEYS.THEME, 'object');
        console.log('stored theme = ', storedTheme);
        if (storedTheme) {
            setTheme(storedTheme);
        }
    }

    useEffect(() => {
        const changeStoredTheme = async () => {
            await set(APP_CONSTANTS.STORAGE_KEYS.THEME, theme, 'object');
        }
        changeStoredTheme();
    }, [theme]);

    const toggleTheme = (mode) => {
        setTheme(mode === 'light' ? lightTheme : darkTheme);
    };

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
