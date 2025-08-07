import { createSettingsStyles } from '@/assets/styles/settings.styles'; // Import styles for settings screen components
import useTheme from '@/hooks/useTheme'; // Import custom theme hook for theme management
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for consistent iconography
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient for modern visual styling
import { useState } from 'react';
import { Switch, Text, View } from 'react-native'; // Import React Native components for UI structure

/**
 * Preferences Component
 * Provides user customization options for app behavior and appearance
 * Handles theme switching, notification settings, and sync preferences
 * Offers immediate feedback and persistent settings across app sessions
 */
const Preferences = () => {

    // Local state management for preference toggles
    // These would typically be connected to AsyncStorage for persistence
    const [isAutoSync, setIsAutoSync] = useState(true);           // Auto-sync todos across devices
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true); // Push notifications

    // Get theme context including current mode and toggle function
    const { colors, isDarkMode, toggleDarkMode } = useTheme();
    
    // Create theme-aware styles for settings components
    const settingsStyles = createSettingsStyles(colors);

    return (
        // Section container with surface gradient for visual depth
        <LinearGradient colors={colors.gradients.surface} style={settingsStyles.section}>
            {/* Section title */}
            <Text style={settingsStyles.title}>Preferences</Text>
            
            {/* Dark Mode Toggle Setting */}
            <View style={settingsStyles.settingItem}>
                {/* Left side: Icon and label */}
                <View style={settingsStyles.settingLeft}>
                    {/* Primary gradient icon container for theme setting */}
                    <LinearGradient colors={colors.gradients.primary} style={settingsStyles.settingIcon}>
                        <Ionicons name="moon" size={18} color="#fff" />
                    </LinearGradient>
                    <Text style={settingsStyles.settingText}>Dark Mode</Text>
                </View>
                
                {/* Interactive switch connected to theme context */}
                <Switch 
                    value={isDarkMode}           // Current theme state from context
                    onValueChange={toggleDarkMode}  // Theme toggle function from context
                    thumbColor={"#fff"}          // White thumb for visibility
                    trackColor={{ false: colors.border, true: colors.primary }}  // Dynamic track colors
                    ios_backgroundColor={colors.border}  // iOS-specific background
                />
            </View>

            {/* Notifications Toggle Setting */}
            <View style={settingsStyles.settingItem}>
                <View style={settingsStyles.settingLeft}>
                    {/* Warning gradient for notification settings */}
                    <LinearGradient colors={colors.gradients.warning} style={settingsStyles.settingIcon}>
                        <Ionicons name="notifications" size={18} color="#fff" />
                    </LinearGradient>
                    <Text style={settingsStyles.settingText}>Notifications</Text>
                </View>
                
                {/* Notification preference toggle */}
                <Switch
                    value={isNotificationsEnabled}  // Current notification state
                    onValueChange={() => setIsNotificationsEnabled(!isNotificationsEnabled)}  // Toggle function
                    thumbColor={"#fff"}
                    trackColor={{ false: colors.border, true: colors.warning }}  // Warning color when enabled
                    ios_backgroundColor={colors.border}
                />
            </View>

            {/* Auto Sync Toggle Setting */}
            <View style={settingsStyles.settingItem}>
                <View style={settingsStyles.settingLeft}>
                    {/* Success gradient for sync settings */}
                    <LinearGradient colors={colors.gradients.success} style={settingsStyles.settingIcon}>
                        <Ionicons name="sync" size={18} color="#fff" />
                    </LinearGradient>
                    <Text style={settingsStyles.settingText}>Auto Sync</Text>
                </View>
                
                {/* Auto-sync preference toggle */}
                <Switch
                    value={isAutoSync}           // Current auto-sync state
                    onValueChange={() => setIsAutoSync(!isAutoSync)}  // Toggle function
                    thumbColor={"#fff"}
                    trackColor={{ false: colors.border, true: colors.success }}  // Success color when enabled
                    ios_backgroundColor={colors.border}
                />
            </View>

        </LinearGradient>
    );
};

export default Preferences;