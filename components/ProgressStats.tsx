import { createSettingsStyles } from '@/assets/styles/settings.styles';
import { api } from '@/convex/_generated/api';
import useDeviceId from '@/hooks/useDeviceId';
import useTheme from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

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
    const totalTodos = todos ? todos.length : 0;                                    
    const completedTodos = todos ? todos.filter((todo) => todo.isCompleted).length : 0; 
    const pendingTodos = totalTodos - completedTodos;                              

    
    return (
        <LinearGradient colors={colors.gradients.surface} style={settingStyles.section}>
            <Text style={settingStyles.sectionTitle}>Progress Stats</Text>
            <View style={settingStyles.statsContainer}>
                <LinearGradient
                    colors={colors.gradients.background}    
                    style={[settingStyles.statCard, { borderLeftColor: colors.primary }]}  
                >
                    <View style={settingStyles.statIconContainer}>
                        <LinearGradient colors={colors.gradients.primary} style={settingStyles.statIcon}>
                            <Ionicons name="list" size={20} color="#fff" />  
                        </LinearGradient>
                    </View>

                    <View style={settingStyles.statContent}>
                        <Text style={settingStyles.statNumber}>{totalTodos}</Text> 
                        <Text style={settingStyles.statLabel}>Total Todos</Text>   
                    </View>
                </LinearGradient>

                <LinearGradient
                    colors={colors.gradients.background}
                    style={[settingStyles.statCard, { borderLeftColor: colors.success }]}  
                >
                    <View style={settingStyles.statIconContainer}>
                        <LinearGradient colors={colors.gradients.success} style={settingStyles.statIcon}>
                            <Ionicons name="checkmark-circle" size={20} color="#fff" />  
                        </LinearGradient>
                    </View>

                    <View style={settingStyles.statContent}>
                        <Text style={settingStyles.statNumber}>{completedTodos}</Text>
                        <Text style={settingStyles.statLabel}>Completed</Text>
                    </View>
                </LinearGradient>

                <LinearGradient
                    colors={colors.gradients.background}
                    style={[settingStyles.statCard, { borderLeftColor: colors.warning }]}  
                >
                    <View style={settingStyles.statIconContainer}>
                        <LinearGradient colors={colors.gradients.warning} style={settingStyles.statIcon}>
                            <Ionicons name="time" size={20} color="#fff" /> 
                        </LinearGradient>
                    </View>
                        
                    <View style={settingStyles.statContent}>
                        <Text style={settingStyles.statNumber}>{pendingTodos}</Text>
                        <Text style={settingStyles.statLabel}>Pending</Text> 
                    </View>
                </LinearGradient>
            </View>
        </LinearGradient>
    );
};

export default ProgressStats;