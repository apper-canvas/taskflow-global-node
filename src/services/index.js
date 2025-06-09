export * as taskService from './api/taskService';
export * as categoryService from './api/categoryService';

// Utility function for simulating API delays
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));