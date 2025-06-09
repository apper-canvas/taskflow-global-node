import React, { useState } from 'react';
import ContactForm from '@/components/organisms/ContactForm';
import Button from '@/components/atoms/Button';
import { toast } from 'react-toastify';
import { ApperIcon } from '@/components/ApperIcon';

const MainFeature = ({ tasks, categories, onAddTask, onDeleteTask, onUpdateTask }) => {
    const [currentFilter, setCurrentFilter] = useState('all');
    const [editTaskId, setEditTaskId] = useState(null);

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'completed') return task.status === 'completed';
        if (currentFilter === 'pending') return task.status === 'pending';
        return task.category === currentFilter;
    });

    const handleFormSubmit = async (taskData) => {
        try {
            if (editTaskId) {
                await onUpdateTask(editTaskId, taskData);
                toast.success('Task updated successfully!');
            } else {
                await onAddTask(taskData);
                toast.success('Task added successfully!');
            }
            setEditTaskId(null); // Clear edit mode
        } catch (error) {
            toast.error(`Operation failed: ${error.message || 'Unknown error'}`);
        }
    };

    const handleEditClick = (task) => {
        setEditTaskId(task.id);
    };

    const handleCancelEdit = () => {
        setEditTaskId(null);
    };

    const getTaskToEdit = () => {
        return tasks.find(task => task.id === editTaskId);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Task Management</h2>

            <div className="mb-6">
                <ContactForm
                    onSubmit={handleFormSubmit}
                    categories={categories}
                    initialData={getTaskToEdit()}
                    onCancelEdit={handleCancelEdit}
                />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                <Button
                    onClick={() => setCurrentFilter('all')}
                    className={`px-4 py-2 rounded-lg ${currentFilter === 'all' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    All
                </Button>
                <Button
                    onClick={() => setCurrentFilter('completed')}
                    className={`px-4 py-2 rounded-lg ${currentFilter === 'completed' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Completed
                </Button>
                <Button
                    onClick={() => setCurrentFilter('pending')}
                    className={`px-4 py-2 rounded-lg ${currentFilter === 'pending' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Pending
                </Button>
                {categories.map(category => (
                    <Button
                        key={category.id}
                        onClick={() => setCurrentFilter(category.name)}
                        className={`px-4 py-2 rounded-lg ${currentFilter === category.name ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        {category.name}
                    </Button>
                ))}
            </div>

            <ul className="space-y-4">
                {filteredTasks.length === 0 ? (
                    <li className="text-center text-gray-500 py-4">No tasks found.</li>
                ) : (
                    filteredTasks.map(task => (
                        <li key={task.id} className="bg-gray-100 p-4 rounded-lg shadow flex justify-between items-center">
                            <div>
                                <h3 className={`font-semibold text-lg ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                    {task.title}
                                </h3>
                                <p className="text-sm text-gray-600">{task.description}</p>
                                <p className="text-xs text-gray-500">Category: {task.category}</p>
                                <p className="text-xs text-gray-500">Status: {task.status}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleEditClick(task)}
                                    className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
                                >
                                    <ApperIcon name="edit" className="w-5 h-5" />
                                </Button>
                                <Button
                                    onClick={() => onDeleteTask(task.id)}
                                    className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition duration-300"
                                >
                                    <ApperIcon name="trash" className="w-5 h-5" />
                                </Button>
                                <Button
                                    onClick={() => onUpdateTask(task.id, { status: task.status === 'completed' ? 'pending' : 'completed' })}
                                    className={`p-2 rounded-full ${task.status === 'completed' ? 'bg-yellow-500' : 'bg-green-500'} text-white hover:${task.status === 'completed' ? 'bg-yellow-600' : 'bg-green-600'} transition duration-300`}
                                >
                                    <ApperIcon name={task.status === 'completed' ? 'pending' : 'check'} className="w-5 h-5" />
                                </Button>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default MainFeature;