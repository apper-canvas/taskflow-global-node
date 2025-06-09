import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isToday, isPast, parseISO } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import MainFeature from '../components/MainFeature';
import * as taskService from '../services/api/taskService';
import * as categoryService from '../services/api/categoryService';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    status: 'active',
    priority: [],
    categoryIds: [],
    dateRange: null,
    searchQuery: ''
  });
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [newTask, ...prev]);
      toast.success('Task created successfully');
      setShowQuickAdd(false);
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const updatedTask = await taskService.update(taskId, {
        completed: true,
        completedAt: new Date().toISOString()
      });
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      toast.success('Task completed!');
    } catch (err) {
      toast.error('Failed to complete task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, updates);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      toast.success('Task updated');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      // Status filter
      if (filter.status === 'active' && task.completed) return false;
      if (filter.status === 'completed' && !task.completed) return false;

      // Category filter
      if (selectedCategory !== 'all' && task.categoryId !== selectedCategory) return false;
      if (filter.categoryIds.length > 0 && !filter.categoryIds.includes(task.categoryId)) return false;

      // Priority filter
      if (filter.priority.length > 0 && !filter.priority.includes(task.priority)) return false;

      // Search filter
      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase();
        return task.title.toLowerCase().includes(query) || 
               (task.description && task.description.toLowerCase().includes(query));
      }

      return true;
    });
  };

  const getTodaysTasks = () => {
    return tasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      isToday(parseISO(task.dueDate))
    );
  };

  const getOverdueTasks = () => {
    return tasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      isPast(parseISO(task.dueDate)) && 
      !isToday(parseISO(task.dueDate))
    );
  };

  const getCompletionRate = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  };

  const filteredTasks = getFilteredTasks();
  const todaysTasks = getTodaysTasks();
  const overdueTasks = getOverdueTasks();
  const completionRate = getCompletionRate();

  if (loading) {
    return (
      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 bg-surface-50 border-r border-surface-200 p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-10 bg-surface-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
              >
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                  <div className="h-4 bg-surface-200 rounded w-1/2"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Something went wrong</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden max-w-full">
      {/* Sidebar */}
      <div className="w-80 bg-surface-50 border-r border-surface-200 overflow-y-auto">
        <div className="p-6">
          {/* Quick Stats */}
          <div className="mb-6">
            <h2 className="font-heading font-semibold text-surface-900 mb-4">Overview</h2>
            <div className="space-y-3">
              {overdueTasks.length > 0 && (
                <div className="bg-error/10 border border-error/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-error">
                    <ApperIcon name="AlertCircle" size={16} />
                    <span className="text-sm font-medium">{overdueTasks.length} Overdue</span>
                  </div>
                </div>
              )}
              
              {todaysTasks.length > 0 && (
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-warning">
                    <ApperIcon name="Clock" size={16} />
                    <span className="text-sm font-medium">{todaysTasks.length} Due Today</span>
                  </div>
                </div>
              )}
              
              <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-success">
                    <ApperIcon name="TrendingUp" size={16} />
                    <span className="text-sm font-medium">Progress</span>
                  </div>
                  <span className="text-sm font-semibold text-success">
                    {Math.round(completionRate)}%
                  </span>
                </div>
                <div className="mt-2 bg-success/20 rounded-full h-2">
                  <div 
                    className="bg-success rounded-full h-2 transition-all duration-300"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h2 className="font-heading font-semibold text-surface-900 mb-4">Categories</h2>
            <div className="space-y-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory('all')}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                  selectedCategory === 'all' 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-surface-100 text-surface-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ApperIcon name="Layers" size={16} />
                  <span className="font-medium">All Tasks</span>
                </div>
                <span className="text-sm">
                  {tasks.filter(t => !t.completed).length}
                </span>
              </motion.button>

              {categories.map(category => {
                const categoryTasks = tasks.filter(t => 
                  t.categoryId === category.id && !t.completed
                );
                return (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id 
                        ? 'bg-primary text-white' 
                        : 'hover:bg-surface-100 text-surface-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="text-sm">{categoryTasks.length}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <MainFeature
          tasks={filteredTasks}
          categories={categories}
          filter={filter}
          onFilterChange={setFilter}
          onCreateTask={handleCreateTask}
          onCompleteTask={handleCompleteTask}
          onDeleteTask={handleDeleteTask}
          onUpdateTask={handleUpdateTask}
          showQuickAdd={showQuickAdd}
          onToggleQuickAdd={setShowQuickAdd}
          selectedCategory={selectedCategory}
        />
      </div>
    </div>
  );
};

export default Home;