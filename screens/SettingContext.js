import React, { createContext, useState, useEffect } from 'react';
import { AsyncStorage } from 'react-native';

// Create a Context for settings
const SettingsContext = createContext();

const SettingsProvider = ({ children }) => {
  // Initial state values
  const [settings, setSettings] = useState({
    isTafseerVisible: true,
    language: 'ur', // 'ur' for Urdu, 'en' for English
  });

  // Load settings from AsyncStorage on initial load
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem('settings');
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings));
        }
      } catch (error) {
        console.error('Error loading settings from AsyncStorage', error);
      }
    };

    loadSettings();
  }, []);

  // Save settings to AsyncStorage
  const saveSettings = async (newSettings) => {
    try {
      setSettings(newSettings); // Update the state with the new settings
      await AsyncStorage.setItem('settings', JSON.stringify(newSettings)); // Save the settings to AsyncStorage
    } catch (error) {
      console.error('Error saving settings to AsyncStorage', error); // Handle any errors
    }
  };

  // Toggle language between Urdu and English
  const toggleLanguage = () => {
    const newLanguage = settings.language === 'ur' ? 'en' : 'ur';
    saveSettings({ ...settings, language: newLanguage });
  };

  // Toggle Tafseer visibility
  const toggleTafseer = () => {
    saveSettings({ ...settings, isTafseerVisible: !settings.isTafseerVisible });
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        toggleLanguage,
        toggleTafseer,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsProvider, SettingsContext };
