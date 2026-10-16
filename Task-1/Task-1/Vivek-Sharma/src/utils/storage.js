const TASKS_KEY = 'taskflow.tasks.v1';
const THEME_KEY = 'taskflow.theme.v1';

export function loadTasks() {
  try {
    const value = JSON.parse(localStorage.getItem(TASKS_KEY) || '[]');
    if (!Array.isArray(value)) return [];
    return value.filter((task) => task && typeof task.id === 'string' && typeof task.title === 'string').map((task) => ({
      id: task.id,
      title: task.title,
      completed: Boolean(task.completed),
      priority: ['low', 'medium', 'high'].includes(task.priority) ? task.priority : 'medium',
      dueDate: typeof task.dueDate === 'string' ? task.dueDate : '',
      createdAt: typeof task.createdAt === 'string' ? task.createdAt : new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch {
    // Storage can be unavailable in private browsing; the app remains usable in memory.
  }
}

export function loadTheme() {
  try {
    return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Ignore storage failures while keeping the selected theme for the session.
  }
}
