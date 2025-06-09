import { delay } from '../index';

// Import mock data
import tasksData from '../mockData/tasks.json';

// In-memory storage for tasks
let tasks = [...tasksData];

export const getAll = async () => {
  await delay(300);
  return [...tasks];
};

export const getById = async (id) => {
  await delay(200);
  const task = tasks.find(t => t.id === id);
  if (!task) {
    throw new Error('Task not found');
  }
  return { ...task };
};

export const create = async (taskData) => {
  await delay(250);
  const newTask = {
    ...taskData,
    id: Date.now().toString(),
    completed: false,
    completedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  tasks.unshift(newTask);
  return { ...newTask };
};

export const update = async (id, updates) => {
  await delay(200);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    throw new Error('Task not found');
  }
  
  tasks[index] = {
    ...tasks[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  return { ...tasks[index] };
};

export const delete_ = async (id) => {
  await delay(200);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    throw new Error('Task not found');
  }
  
  tasks.splice(index, 1);
  return true;
};

// Alias for better API
export const delete = delete_;