import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, isToday, isPast } from 'date-fns';
import ApperIcon from './ApperIcon';

const MainFeature = ({
  tasks,
  categories,
  filter,
  onFilterChange,
  onCreateTask,
  onCompleteTask,
  onDeleteTask,
  onUpdateTask,
  showQuickAdd,
  onToggleQuickAdd,
  selectedCategory
}) => {
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    categoryId: categories[0]?.id || '',
    priority: 'medium',
    dueDate: ''
  });

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    onCreateTask({
      ...newTask,
      dueDate: newTask.dueDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    setNewTask({
      title: '',
      description: '',
      categoryId: categories[0]?.id || '',
      priority: 'medium',
      dueDate: ''
    });
  };

  const handleCompleteTask = async (taskId) => {
    // Add completion animation before updating
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskElement) {
      taskElement.classList.add('animate-slide-right');
      setTimeout(() => {
        onCompleteTask(taskId);
      }, 300);
    } else {
      onCompleteTask(taskId);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask({
      ...task,
      dueDate: task.dueDate ? format(parseISO(task.dueDate), 'yyyy-MM-dd') : ''
    });
  };

  const handleUpdateTask = (e) => {
    e.preventDefault();
    if (!editingTask.title.trim()) return;

    onUpdateTask(editingTask.id, {
      ...editingTask,
      dueDate: editingTask.dueDate || null,
      updatedAt: new Date().toISOString()
    });
    setEditingTask(null);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'text-accent',
      high: 'text-error',
      medium: 'text-warning',
      low: 'text-success'
    };
    return colors[priority] || 'text-surface-500';
  };

  const getPriorityBg = (priority) => {
    const backgrounds = {
      urgent: 'priority-urgent',
      high: 'priority-high',
      medium: 'priority-medium',
      low: 'priority-low'
    };
    return backgrounds[priority] || 'bg-surface-100';
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || { name: 'Uncategorized', color: '#94a3b8' };
  };

  if (tasks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="CheckSquare" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-xl font-heading font-semibold text-surface-900 mb-2">
            Ready to be productive?
          </h3>
          <p className="text-surface-600 mb-6">
            Create your first task and start organizing your day with TaskFlow.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggleQuickAdd(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
          >
            <ApperIcon name="Plus" size={20} />
            Create Your First Task
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full">
      {/* Header with Quick Add */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-surface-900">
              {selectedCategory === 'all' ? 'All Tasks' : getCategoryInfo(selectedCategory).name}
            </h1>
            <p className="text-surface-600">
              {tasks.filter(t => !t.completed).length} active, {tasks.filter(t => t.completed).length} completed
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggleQuickAdd(!showQuickAdd)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
          >
            <ApperIcon name="Plus" size={20} />
            Add Task
          </motion.button>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-surface-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-surface-700">Status:</span>
            <select
              value={filter.status}
              onChange={(e) => onFilterChange({...filter, status: e.target.value})}
              className="px-3 py-1 bg-surface-50 border border-surface-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-surface-700">Priority:</span>
            <select
              value={filter.priority[0] || ''}
              onChange={(e) => onFilterChange({
                ...filter, 
                priority: e.target.value ? [e.target.value] : []
              })}
              className="px-3 py-1 bg-surface-50 border border-surface-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex-1" />

          <div className="relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={filter.searchQuery}
              onChange={(e) => onFilterChange({...filter, searchQuery: e.target.value})}
              className="pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-0"
            />
          </div>
        </div>

        {/* Quick Add Form */}
        <AnimatePresence>
          {showQuickAdd && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleQuickAdd} className="mt-4 p-4 bg-white rounded-lg border border-surface-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="What needs to be done?"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      className="w-full px-4 py-3 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      autoFocus
                    />
                  </div>
                  
                  <select
                    value={newTask.categoryId}
                    onChange={(e) => setNewTask({...newTask, categoryId: e.target.value})}
                    className="px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>

                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>

                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    className="px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={!newTask.title.trim()}
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                    >
                      Add Task
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => onToggleQuickAdd(false)}
                      className="px-4 py-2 text-surface-600 hover:text-surface-800 transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {tasks.map((task, index) => {
            const category = getCategoryInfo(task.categoryId);
            const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate)) && !task.completed;
            const isDueToday = task.dueDate && isToday(parseISO(task.dueDate)) && !task.completed;

            return (
              <motion.div
                key={task.id}
                data-task-id={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 100, scale: 0.8 }}
                transition={{ 
                  duration: 0.2,
                  delay: index * 0.1,
                  layout: { duration: 0.2 }
                }}
                className={`bg-white rounded-lg border border-surface-200 hover:shadow-md transition-all group ${
                  task.completed ? 'opacity-60' : ''
                } ${
                  isOverdue ? 'border-error bg-error/5' : ''
                } ${
                  isDueToday ? 'border-warning bg-warning/5' : ''
                }`}
              >
                {editingTask?.id === task.id ? (
                  <form onSubmit={handleUpdateTask} className="p-4">
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editingTask.title}
                        onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                        className="w-full px-3 py-2 border border-surface-200 rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
                        autoFocus
                      />
                      <textarea
                        value={editingTask.description || ''}
                        onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                        placeholder="Description..."
                        className="w-full px-3 py-2 border border-surface-200 rounded focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                        rows={2}
                      />
                      <div className="flex gap-3">
                        <select
                          value={editingTask.categoryId}
                          onChange={(e) => setEditingTask({...editingTask, categoryId: e.target.value})}
                          className="flex-1 px-3 py-2 border border-surface-200 rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                        <select
                          value={editingTask.priority}
                          onChange={(e) => setEditingTask({...editingTask, priority: e.target.value})}
                          className="flex-1 px-3 py-2 border border-surface-200 rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                        <input
                          type="date"
                          value={editingTask.dueDate}
                          onChange={(e) => setEditingTask({...editingTask, dueDate: e.target.value})}
                          className="flex-1 px-3 py-2 border border-surface-200 rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary/90"
                        >
                          Save
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={() => setEditingTask(null)}
                          className="px-3 py-1 text-surface-600 hover:text-surface-800 text-sm"
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCompleteTask(task.id)}
                        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          task.completed 
                            ? 'bg-success border-success text-white' 
                            : 'border-surface-300 hover:border-primary'
                        }`}
                      >
                        {task.completed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="animate-bounce-subtle"
                          >
                            <ApperIcon name="Check" size={12} />
                          </motion.div>
                        )}
                      </motion.button>

                      {/* Task Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className={`font-medium text-surface-900 break-words ${
                            task.completed ? 'line-through text-surface-500' : ''
                          }`}>
                            {task.title}
                          </h3>
                          
                          {/* Priority Indicator */}
                          <div className={`flex-shrink-0 px-2 py-1 rounded text-xs font-medium ml-2 ${getPriorityBg(task.priority)} text-white`}>
                            {task.priority.toUpperCase()}
                          </div>
                        </div>

                        {task.description && (
                          <p className="text-sm text-surface-600 mb-2 break-words">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {/* Category */}
                            <div className="flex items-center gap-1">
                              <div 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: category.color }}
                              />
                              <span className="text-xs text-surface-600">{category.name}</span>
                            </div>

                            {/* Due Date */}
                            {task.dueDate && (
                              <div className={`flex items-center gap-1 text-xs ${
                                isOverdue ? 'text-error' : isDueToday ? 'text-warning' : 'text-surface-600'
                              }`}>
                                <ApperIcon name="Calendar" size={12} />
                                <span>
                                  {isToday(parseISO(task.dueDate)) 
                                    ? 'Today' 
                                    : format(parseISO(task.dueDate), 'MMM d')
                                  }
                                </span>
                                {isOverdue && (
                                  <span className="text-error font-medium">(Overdue)</span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEditTask(task)}
                              className="p-1 text-surface-400 hover:text-primary transition-colors"
                            >
                              <ApperIcon name="Edit2" size={14} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onDeleteTask(task.id)}
                              className="p-1 text-surface-400 hover:text-error transition-colors"
                            >
                              <ApperIcon name="Trash2" size={14} />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MainFeature;