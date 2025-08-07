import { createHomeStyles } from "@/assets/styles/home.styles";
import EmptyState from "@/components/EmptyState";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import TodoInput from "@/components/TodoInput";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import useDeviceId from "@/hooks/useDeviceId";
import useTheme from "@/hooks/useTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Alert, FlatList, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Type definition for a Todo item based on the Convex database schema
type Todo = Doc<"todos">;

export default function Index() {
  // Get the current theme colors for consistent styling across the app
  const {colors} = useTheme();
  
  // Get device ID for user identification
  const { deviceId, isLoading: deviceIdLoading } = useDeviceId();

  // State management for inline editing functionality
  const [editingId, setEditingId] = useState<Id<"todos"> | null>(null);
  const [editText, setEditText] = useState("");

  // Create styles based on current theme colors
  const homeStyles = createHomeStyles(colors);

  // Convex database operations - now include device ID for user isolation
  const todos = useQuery(api.todos.getTodos, deviceId ? { deviceId } : "skip");
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);
  const updateTodo = useMutation(api.todos.updateTodo);

  // Check if data is still loading (either device ID or todos)
  const isLoading = deviceIdLoading || todos === undefined;

  // Show loading spinner while data is being fetched
  if(isLoading) return <LoadingSpinner/>

  // Don't render anything if device ID is not available
  if (!deviceId) return <LoadingSpinner/>

  /**
   * Toggle the completion status of a todo item
   * Now includes device ID for authorization
   */
  const handleToggleTodo = async(id: Id<"todos">) => {
    try {
      await toggleTodo({id, deviceId});
    } catch (error) {
      console.log("Error toggling todo:", error);
      Alert.alert("Error", "Failed to update todo. Please try again.");
    }
  };

  /**
   * Delete a todo item with confirmation dialog
   * Now includes device ID for authorization
   */
  const handleDeleteTodo = async(id: Id<"todos">) => {
      Alert.alert("Delete Todo", "Are you sure you want to delete this todo?", [
        { text: "Cancel", style: "cancel"},
        { text: "Delete", style: "destructive", onPress: () => deleteTodo({id, deviceId}) },
      ]);
  };

  /**
   * Initialize inline editing mode for a todo item
   */
  const handleEditTodo = (todo: Todo) => {
    setEditingId(todo._id);
    setEditText(todo.text);
  };

  /**
   * Save the edited todo text to the database
   * Now includes device ID for authorization
   */
  const handleSaveEdit = async() => {
    if(editingId) {
      try {
        await updateTodo({id: editingId, text: editText.trim(), deviceId});
        setEditingId(null);
        setEditText("");
      } catch (error) {
        console.log("Error updating todo:", error);
        Alert.alert("Error", "Failed to update todo. Please try again.");
      }
    }
  };

  /**
   * Cancel editing mode without saving changes
   */
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  /**
   * Render function for individual todo items in the FlatList
   * Handles both display and edit modes with conditional rendering
   */
  const renderTodoItem = ({ item }: { item: Todo }) => {
    const isEditing = editingId === item._id;

    return (
      <View style={homeStyles.todoItemWrapper}>
        <LinearGradient 
        colors={colors.gradients.surface} 
        style={homeStyles.todoItem}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity 
          style={homeStyles.checkbox} 
          activeOpacity={0.7}
          onPress={() => handleToggleTodo(item._id)}
          >
            <LinearGradient 
            colors={item.isCompleted ? colors.gradients.success : colors.gradients.muted}
            style={[
              homeStyles.checkboxInner,
              {borderColor: item.isCompleted ? "transparent" : colors.border},
            ]}
            >{item.isCompleted && <Ionicons name="checkmark" size={18} color="#fff" />}</LinearGradient>
          </TouchableOpacity>

          {isEditing  ? (
            <View style={homeStyles.editContainer}>
              <TextInput
                style={homeStyles.editInput}
                value={editText}
                onChangeText={setEditText}
                autoFocus 
                multiline 
                placeholder="Edit todo..."
                placeholderTextColor={colors.textMuted}
              />
              <View style={homeStyles.editButtons}>
                <TouchableOpacity onPress={handleSaveEdit} activeOpacity={0.8}>
                  <LinearGradient colors={colors.gradients.success} style={homeStyles.editButton}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                    <Text style={homeStyles.editButtonText}>Save</Text> 
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleCancelEdit} activeOpacity={0.8}>
                  <LinearGradient colors={colors.gradients.muted} style={homeStyles.editButton}>
                    <Ionicons name="close" size={16} color="#fff" />
                    <Text style={homeStyles.editButtonText}>Cancel</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style = {homeStyles.todoTextContainer}>
              <Text style={[
                  homeStyles.todoText,
                  item.isCompleted && {
                    textDecorationLine: "line-through",
                    color: colors.textMuted,
                    opacity: 0.6,
                  },
                ]}
              >{item.text}</Text>

             
              <View style={homeStyles.todoActions}>
                <TouchableOpacity onPress={() => handleEditTodo(item)} activeOpacity={0.8}>
                  <LinearGradient colors={colors.gradients.warning} style={homeStyles.actionButton}>
                    <Ionicons name="pencil" size={14} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => handleDeleteTodo(item._id)} activeOpacity={0.8}>
                  <LinearGradient colors={colors.gradients.danger} style={homeStyles.actionButton}>
                    <Ionicons name="trash" size={14} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </LinearGradient>
      </View>
    );
  };

  // Main component render - App layout structure
  return (
    <LinearGradient colors={colors.gradients.background} style={homeStyles.container}>
      <StatusBar barStyle={colors.statusBarStyle} />
        <SafeAreaView style={homeStyles.safeArea}>
          
          <Header />

          <TodoInput />
        
          <FlatList
            data={todos}
            renderItem={renderTodoItem}
            keyExtractor={(item) => item._id}
            style={homeStyles.todoList}
            contentContainerStyle={homeStyles.todoListContent}
            ListEmptyComponent={<EmptyState />}
          />

        </SafeAreaView>
    </LinearGradient>
  );
}
