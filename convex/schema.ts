// Import Convex schema definition utilities for creating database structure
import { defineSchema, defineTable } from 'convex/server';
// Import validation utilities for type checking and data integrity
import { v } from 'convex/values';

/**
 * Database Schema Definition
 * Defines the structure and validation rules for all database tables
 * This schema ensures type safety and data consistency across the application
 */
export default defineSchema({
    /**
     * Todos Table Schema
     * Defines the structure for todo items stored in the database
     * Each todo has text content and a completion status
     */
    todos: defineTable({
        // Todo text content - stores the actual task description
        text: v.string(),        // Required string field for todo content
        
        // Completion status - tracks whether the todo is done or not
        isCompleted: v.boolean(), // Required boolean field for completion state
        
        // Note: Convex automatically adds these fields:
        // - _id: unique identifier for each todo item
        // - _creationTime: timestamp when the todo was created
    }),
    
    // Additional tables can be added here as the app grows
    // Example potential tables:
    // users: defineTable({ ... }),     // User profiles and authentication
    // categories: defineTable({ ... }), // Todo categories/tags
    // settings: defineTable({ ... }),   // User preferences and app settings
});