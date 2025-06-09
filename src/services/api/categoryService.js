import { delay } from '../index';

// Import mock data
import categoriesData from '../mockData/categories.json';

// In-memory storage for categories
let categories = [...categoriesData];

export const getAll = async () => {
  await delay(200);
  return [...categories];
};

export const getById = async (id) => {
  await delay(150);
  const category = categories.find(c => c.id === id);
  if (!category) {
    throw new Error('Category not found');
  }
  return { ...category };
};

export const create = async (categoryData) => {
  await delay(250);
  const newCategory = {
    ...categoryData,
    id: Date.now().toString(),
    taskCount: 0,
    order: categories.length
  };
  categories.push(newCategory);
  return { ...newCategory };
};

export const update = async (id, updates) => {
  await delay(200);
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Category not found');
  }
  
  categories[index] = {
    ...categories[index],
    ...updates
  };
  
  return { ...categories[index] };
};

export const delete_ = async (id) => {
  await delay(200);
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Category not found');
  }
  
  categories.splice(index, 1);
  return true;
};

// Alias for better API
export const delete = delete_;