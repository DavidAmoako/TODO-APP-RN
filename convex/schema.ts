// Import Convex schema definition utilities for creating database structure
import { defineSchema, defineTable } from 'convex/server';
// Import validation utilities for type checking and data integrity
import { v } from 'convex/values';

/**
 * Database Schema Definition with Device-Based User Identification
 * Uses device IDs instead of email authentication for user data isolation
 */
export default defineSchema({
    /**
     * Todos Table Schema (Device-Based User Isolation)
     * Associates todos with unique device identifiers
     */
    todos: defineTable({
        // Todo text content - stores the actual task description
        text: v.string(),        // Required string field for todo content
        
        // Completion status - tracks whether the todo is done or not
        isCompleted: v.boolean(), // Required boolean field for completion state
        
        // Device ID - unique identifier for device/user isolation
        deviceId: v.string(),   // Device-generated unique identifier
        
        // Note: Convex automatically adds these fields:
        // - _id: unique identifier for each todo item
        // - _creationTime: timestamp when the todo was created
    }).index("by_device", ["deviceId"]), // Index for efficient device-specific queries
});