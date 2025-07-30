import { createSettingsStyles } from '@/assets/styles/settings.styles';
import DangerZone from '@/components/DangerZone';
import Preferences from '@/components/Preferences';
import ProgressStats from '@/components/ProgressStats';
import useTheme from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Settings Screen Component
 * Main settings page that provides access to app configuration and statistics
 * Features: User preferences, progress tracking, and dangerous operations
 */
const SettingsScreen = () => {

  // Get current theme colors for consistent styling across the app
  const { colors } = useTheme();

  // Create theme-aware styles for the settings screen
  const settingStyles = createSettingsStyles(colors);

  return (
    // Full-screen gradient background matching the app's theme
    <LinearGradient colors={colors.gradients.background} style={settingStyles.container}>
      {/* Safe area wrapper to handle device-specific spacing (notches, etc.) */}
      <SafeAreaView style={settingStyles.safeArea}>
        
        {/* Settings Screen Header */}
        <View style={settingStyles.header}>
          <View style={settingStyles.titleContainer}>
            {/* Settings icon with gradient background for visual consistency */}
            <LinearGradient colors={colors.gradients.primary} style={settingStyles.iconContainer}>
              <Ionicons name="settings" size={28} color="#fff" />
            </LinearGradient>
            {/* Screen title */}
            <Text style={settingStyles.title}>Settings</Text>
          </View>
        </View>

        {/* Scrollable Settings Content Container */}
        <ScrollView
          style={settingStyles.scrollView}
          contentContainerStyle={settingStyles.content}
          showsVerticalScrollIndicator={false} // Hide scroll indicator for cleaner look
        >

          {/* Progress Statistics Section */}
          {/* Displays user's todo completion stats, productivity metrics, and achievements */}
          <ProgressStats />

          {/* User Preferences Section */}
          {/* Contains theme toggle, notification settings, and other user customizations */}
          <Preferences />

          {/* Danger Zone Section */}
          {/* Contains destructive actions like clearing all todos, resetting app data */}
          {/* Styled with warning colors and confirmation dialogs for safety */}
          <DangerZone />

        </ScrollView>

      </SafeAreaView>
    </LinearGradient>
  )
}

export default SettingsScreen

