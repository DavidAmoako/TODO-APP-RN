import { createSettingsStyles } from '@/assets/styles/settings.styles'; // Import styles for settings screen components
import { api } from '@/convex/_generated/api'; // Import Convex API for real-time database operations
import useDeviceId from '@/hooks/useDeviceId'; // Import device ID hook for user-specific data
import useTheme from '@/hooks/useTheme'; // Import custom theme hook for consistent styling
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for consistent iconography
import { useQuery } from 'convex/react'; // Import Convex query hook for real-time data fetching
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient for modern visual styling
import { Text, View } from 'react-native'; // Import React Native components for UI structure

/**
 * ProgressStats Component
 * Displays real-time productivity statistics and task completion metrics for the current device
 * Provides visual dashboard with animated cards showing todo progress
 * Helps users track their productivity and task completion patterns
 * All data is isolated per device for privacy and security
 */
const ProgressStats = () => {
    // Get current theme colors for consistent styling across light/dark modes
    const { colors } = useTheme();
    
    // Get device ID for user-specific data isolation
    const { deviceId } = useDeviceId();
    
    // Create theme-aware styles for settings components
    const settingStyles = createSettingsStyles(colors);

    // Real-time query to fetch device-specific todos from database
    // Always call the query, deviceId might be undefined initially but that's handled by the backend
    // Automatically updates when todos are added, completed, or deleted for this specific device
    const todos = useQuery(api.todos.getTodos, { deviceId: deviceId ?? undefined });
    
    // Calculate statistics with comprehensive null safety for loading states
    const totalTodos = todos ? todos.length : 0;                                    // Total number of todos for this device
    const completedTodos = todos ? todos.filter((todo) => todo.isCompleted).length : 0;  // Completed todos count
    const pendingTodos = totalTodos - completedTodos;                               // Active/pending todos count

    
    return (
        // Section container with surface gradient for visual depth
        <LinearGradient colors={colors.gradients.surface} style={settingStyles.section}>
            {/* Section title */}
            <Text style={settingStyles.sectionTitle}>Progress Stats</Text>

            {/* Statistics cards container - displays metrics in a grid layout */}
            <View style={settingStyles.statsContainer}>

                {/* Total Todos Statistics Card */}
                <LinearGradient
                    colors={colors.gradients.background}    // Background gradient for card depth
                    style={[settingStyles.statCard, { borderLeftColor: colors.primary }]}  // Primary accent border
                >
                    {/* Icon container with gradient background */}
                    <View style={settingStyles.statIconContainer}>
                        <LinearGradient colors={colors.gradients.primary} style={settingStyles.statIcon}>
                            <Ionicons name="list" size={20} color="#fff" />  {/* List icon represents all todos */}
                        </LinearGradient>
                    </View>

                    {/* Statistics content - number and label */}
                    <View style={settingStyles.statContent}>
                        <Text style={settingStyles.statNumber}>{totalTodos}</Text>  {/* Large number display */}
                        <Text style={settingStyles.statLabel}>Total Todos</Text>    {/* Descriptive label */}
                    </View>
                </LinearGradient>

                {/* Completed Todos Statistics Card */}
                <LinearGradient
                    colors={colors.gradients.background}
                    style={[settingStyles.statCard, { borderLeftColor: colors.success }]}  // Success green accent
                >
                    {/* Success-themed icon container */}
                    <View style={settingStyles.statIconContainer}>
                        <LinearGradient colors={colors.gradients.success} style={settingStyles.statIcon}>
                            <Ionicons name="checkmark-circle" size={20} color="#fff" />  {/* Checkmark for completion */}
                        </LinearGradient>
                    </View>

                    {/* Completed todos count and label */}
                    <View style={settingStyles.statContent}>
                        <Text style={settingStyles.statNumber}>{completedTodos}</Text>
                        <Text style={settingStyles.statLabel}>Completed</Text>
                    </View>
                </LinearGradient>

                {/* Active/Pending Todos Statistics Card */}
                <LinearGradient
                    colors={colors.gradients.background}
                    style={[settingStyles.statCard, { borderLeftColor: colors.warning }]}  // Warning orange accent
                >
                    {/* Warning-themed icon container */}
                    <View style={settingStyles.statIconContainer}>
                        <LinearGradient colors={colors.gradients.warning} style={settingStyles.statIcon}>
                            <Ionicons name="time" size={20} color="#fff" />  {/* Clock icon for pending tasks */}
                        </LinearGradient>
                    </View>
                        
                    {/* Active todos count and label */}
                    <View style={settingStyles.statContent}>
                        <Text style={settingStyles.statNumber}>{pendingTodos}</Text>
                        <Text style={settingStyles.statLabel}>Pending</Text>  {/* Clear labeling for remaining tasks */}
                    </View>
                </LinearGradient>
            </View>
        </LinearGradient>
    );
};

export default ProgressStats;