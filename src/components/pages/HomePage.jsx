import React, { useState, useEffect } from 'react';
import MainFeature from '@/components/organisms/MainFeature';
import { fetchAllTasks, addTask, deleteTask, updateTask } from '@/services/api/taskService';
import { fetchAllCategories } from '@/services/api/categoryService';

const HomePage = () => {
    const [taskData, setTaskData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const tasks = await fetchAllTasks();
                const categoriesData = await fetchAllCategories();
                setTaskData(tasks);
                setCategories(categoriesData);
            } catch (err) {
                setError('Failed to fetch data.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const handleAddTask = async (newTask) => {
        try {
            const addedTask = await addTask(newTask);
            setTaskData(prev => [...prev, addedTask]);
            return addedTask;
        } catch (err) {
            setError('Failed to add task.');
            console.error(err);
            throw err;
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await deleteTask(id);
            setTaskData(prev => prev.filter(task => task.id !== id));
        } catch (err) {
            setError('Failed to delete task.');
            console.error(err);
        }
    };

    const handleUpdateTask = async (id, updatedFields) => {
        try {
            const updatedTask = await updateTask(id, updatedFields);
            setTaskData(prev => prev.map(task => task.id === id ? updatedTask : task));
            return updatedTask;
        } catch (err) {
            setError('Failed to update task.');
            console.error(err);
            throw err;
        }
    };

    if (isLoading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4 flex-1 overflow-y-auto">
            <MainFeature
                tasks={taskData}
                categories={categories}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                onUpdateTask={handleUpdateTask}
            />
        </div>
    );
};

export default HomePage;