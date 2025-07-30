// Import Convex utilities for database operations and input validation
import { ConvexError, v } from 'convex/values';
// Import Convex server functions to define database operations
import { mutation, query } from './_generated/server';

/**
 * Query: Get All Todos
 * Retrieves all todo items from the database ordered by creation date (newest first)
 * This is a reactive query - UI automatically updates when data changes
 */
export const getTodos = query({
    handler: async (ctx) => {
        // Query the 'todos' table, order by creation date (desc = newest first), collect all results
        const todos = await ctx.db.query('todos').order("desc").collect();
        return todos;
    },
});

/**
 * Mutation: Add New Todo
 * Creates a new todo item in the database with the provided text
 * All new todos are created with isCompleted: false by default
 */
export const addTodo = mutation({
    // Input validation: requires a string parameter called 'text'
    args: { text: v.string() },
    handler: async (ctx, args) => {
        // Insert new todo into the database with default completion status
        const todoId = await ctx.db.insert('todos', { 
            text: args.text,           // User-provided todo text
            isCompleted: false         // Default to incomplete status
        });
        return todoId; // Return the generated ID for the new todo
    },
});

/**
 * Mutation: Toggle Todo Completion Status
 * Switches a todo between completed and incomplete states
 * Includes error handling for non-existent todos
 */
export const toggleTodo = mutation({
    // Input validation: requires a valid todo ID
    args: { id: v.id('todos') },
    handler: async (ctx, args) => {
        // First, retrieve the todo to check if it exists and get current status
        const todo = await ctx.db.get(args.id);
        
        // Error handling: throw custom error if todo doesn't exist
        if (!todo) {
            throw new ConvexError('Todo not found');
        }
        
        // Update the todo's completion status to the opposite of current state
        await ctx.db.patch(args.id, { isCompleted: !todo.isCompleted });
    },
});

/**
 * Mutation: Delete Todo
 * Permanently removes a todo item from the database
 * Simple deletion without confirmation (confirmation handled in UI)
 */
export const deleteTodo = mutation({
    // Input validation: requires a valid todo ID
    args: { id: v.id('todos') },
    handler: async (ctx, args) => {
        // Delete the todo from the database using its ID
        await ctx.db.delete(args.id);
    },
});

/**
 * Mutation: Update Todo Text
 * Modifies the text content of an existing todo item
 * Used for inline editing functionality in the UI
 */
export const updateTodo = mutation({
    // Input validation: requires todo ID and new text content
    args: { id: v.id('todos'), text: v.string() },
    handler: async (ctx, args) => {
        // Update only the text field of the specified todo
        await ctx.db.patch(args.id, { text: args.text });
    },
});

/**
 * Mutation: Clear All Todos (Danger Zone Operation)
 * Removes all todo items from the database
 * Returns count of deleted items for user feedback
 * Used in settings "Danger Zone" for bulk operations
 */
export const clearAllTodos = mutation({
    handler: async (ctx) => {
        // First, get all todos to count them before deletion
        const todos = await ctx.db.query('todos').collect();
        
        // Delete each todo individually (Convex doesn't support bulk delete)
        for (const todo of todos) {
            await ctx.db.delete(todo._id);
        }
        
        // Return count of deleted items for user feedback
        return { deletedCount: todos.length };
    },
});


