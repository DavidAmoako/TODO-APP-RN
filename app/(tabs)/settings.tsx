import { createSettingsStyles } from '@/assets/styles/settings.styles';
import DangerZone from '@/components/DangerZone';
import Preferences from '@/components/Preferences';
import ProgressStats from '@/components/ProgressStats';
import useTheme from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
    <LinearGradient colors={colors.gradients.background} style={settingStyles.container}>
      <SafeAreaView style={settingStyles.safeArea}>
        
        <View style={settingStyles.header}>
          <View style={settingStyles.titleContainer}>
            <LinearGradient colors={colors.gradients.primary} style={settingStyles.iconContainer}>
              <Ionicons name="settings" size={28} color="#fff" />
            </LinearGradient>
            <Text style={settingStyles.title}>Settings</Text>
          </View>
        </View>

        <ScrollView
          style={settingStyles.scrollView}
          contentContainerStyle={settingStyles.content}
          showsVerticalScrollIndicator={false} 
        >

          <ProgressStats />
          <Preferences />
          <DangerZone />

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SettingsScreen;
