import { createHomeStyles } from '@/assets/styles/home.styles';
import { api } from '@/convex/_generated/api';
import useDeviceId from '@/hooks/useDeviceId';
import useTheme from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Alert, TextInput, TouchableOpacity, View } from 'react-native';

const TodoInput = () => {
    const { colors } = useTheme();
    const { deviceId } = useDeviceId();
    const homeStyles = createHomeStyles(colors);
    const [newTodo, setNewTodo] = React.useState('');
    const addTodo = useMutation(api.todos.addTodo);

    const handleAddTodo = async() => {
        if (newTodo.trim() && deviceId) {
            try {
                await addTodo({ text: newTodo.trim(), deviceId });
                setNewTodo('');
            } catch (error) {
                Alert.alert("Error", "Failed to add todo. Please try again.");
                console.log("Error adding todo:", error);
            }
        }
    };

  return (
    <View style={homeStyles.inputSection}>
      <View style={homeStyles.inputWrapper}>
        <TextInput
          style={homeStyles.input}
          placeholder="Add a new task..."
          value={newTodo}
          onChangeText={setNewTodo}
          onSubmitEditing={handleAddTodo}
          placeholderTextColor={colors.textMuted}
          returnKeyType="done"
          multiline={false}
          maxLength={200}
        />
        <TouchableOpacity 
        onPress={handleAddTodo} 
        activeOpacity={0.8} 
        disabled={!newTodo.trim()}
        >
          <LinearGradient
            colors={newTodo.trim() ? colors.gradients.primary : colors.gradients.muted}
            style={[homeStyles.addButton, !newTodo.trim() && homeStyles.addButtonDisabled]}
          >
            <Ionicons name="add" size={24} color="#ffffff" />
          </LinearGradient>
        </TouchableOpacity>
        </View>
    </View>
  )
}

export default TodoInput