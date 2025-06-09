import React, { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import { toast } from 'react-toastify';

const ContactForm = ({ onSubmit, categories = [], initialData = null, onCancelEdit }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: categories.length > 0 ? categories[0].name : '',
        status: 'pending'
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                category: initialData.category || (categories.length > 0 ? categories[0].name : ''),
                status: initialData.status || 'pending'
            });
        } else {
            setFormData({
                title: '',
                description: '',
                category: categories.length > 0 ? categories[0].name : '',
                status: 'pending'
            });
        }
    }, [initialData, categories]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            toast.error("Title cannot be empty!");
            return;
        }
        try {
            await onSubmit(formData);
            setFormData({
                title: '',
                description: '',
                category: categories.length > 0 ? categories[0].name : '',
                status: 'pending'
            });
            if (onCancelEdit) onCancelEdit(); // Clear edit mode after successful submit
        } catch (error) {
            // onSubmit already shows toast, just log here if needed
            console.error("Form submission failed:", error);
        }
    };

    const handleCancel = () => {
        setFormData({
            title: '',
            description: '',
            category: categories.length > 0 ? categories[0].name : '',
            status: 'pending'
        });
        if (onCancelEdit) onCancelEdit();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
                label="Title"
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
                required
            />
            <FormField
                label="Description"
                id="description"
                name="description"
                type="textarea" // Custom type for textarea
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description"
            />
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                >
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                </select>
            </div>
            <div className="flex gap-2">
                <Button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-opacity-90 transition duration-300"
                >
                    {initialData ? 'Update Task' : 'Add Task'}
                </Button>
                {initialData && (
                    <Button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400 transition duration-300"
                    >
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    );
};

export default ContactForm;