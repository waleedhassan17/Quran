import React, { useContext } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SettingsContext } from './SettingsContext'; // Import Settings Context

const Settings = () => {
  const { settings, toggleLanguage, toggleTafseer } = useContext(SettingsContext);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      {/* Language Toggle */}
      <View style={styles.settingOption}>
        <Text style={styles.optionText}>Translation Language: {settings.language === 'ur' ? 'Urdu' : 'English'}</Text>
        <Switch
          value={settings.language === 'ur'}
          onValueChange={toggleLanguage}
          thumbColor="#fff"
          trackColor={{ true: '#007AFF', false: '#ccc' }}
        />
      </View>

      {/* Tafseer Toggle */}
      <View style={styles.settingOption}>
        <Text style={styles.optionText}>Tafseer: {settings.isTafseerVisible ? 'On' : 'Off'}</Text>
        <Switch
          value={settings.isTafseerVisible}
          onValueChange={toggleTafseer}
          thumbColor="#fff"
          trackColor={{ true: '#007AFF', false: '#ccc' }}
        />
      </View>

      {/* Save Button (Optional, settings are saved automatically) */}
      <TouchableOpacity
        onPress={() => Alert.alert('Settings Saved')}
        style={styles.saveButton}
      >
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
  },
  settingOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  optionText: {
    color: 'white',
    fontSize: 18,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Settings;
