import { useEffect, useMemo, useState } from 'react';
import { loadTasks, loadTheme, saveTasks, saveTheme } from './utils/storage';

function Icon({ name, className = '' }) {
  const symbols = { check: '✓', circle: '○', clipboard: '▤', edit: '✎', moon: '◐', plus: '+', sparkles: '✦', sun: '☼', trash: '⌫', x: '×' };
  return <span className={`icon-glyph ${className}`} aria-hidden="true">{symbols[name] || '•'}</span>;
}

const filters = [
  { id: 'all', label: 'All tasks' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
];

const priorities = ['low', 'medium', 'high'];

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function formatDueDate(value) {
  if (!value) return 'No due date';
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

function isOverdue(task) {
  return !task.completed && task.dueDate && task.dueDate < todayString();
}

function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [theme, setTheme] = useState(loadTheme);
  const [filter, setFilter] = useState('all');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPriority, setEditPriority] = useState('medium');
  const [editDueDate, setEditDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => saveTasks(tasks), [tasks]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    saveTheme(theme);
  }, [theme]);

  const counts = useMemo(() => ({
    total: tasks.length,
    active: tasks.filter((task) => !task.completed).length,
    completed: tasks.filter((task) => task.completed).length,
  }), [tasks]);

  const visibleTasks = useMemo(() => tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  }), [tasks, filter]);

  function addTask(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError('Give your task a title first.');
      return;
    }
    setTasks((current) => [{ id: crypto.randomUUID(), title: cleanTitle, completed: false, priority, dueDate, createdAt: new Date().toISOString() }, ...current]);
    setTitle('');
    setPriority('medium');
    setDueDate('');
    setError('');
  }

  function toggleTask(id) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, completed: !task.completed } : task));
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id));
    if (editingId === id) cancelEdit();
  }

  function startEdit(task) {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate || '');
    setError('');
  }

  function saveEdit(id) {
    const cleanTitle = editTitle.trim();
    if (!cleanTitle) {
      setError('A task title cannot be empty.');
      return;
    }
    setTasks((current) => current.map((task) => task.id === id ? { ...task, title: cleanTitle, priority: editPriority, dueDate: editDueDate } : task));
    cancelEdit();
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle('');
    setError('');
  }

  function clearCompleted() {
    if (counts.completed) setTasks((current) => current.filter((task) => !task.completed));
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="TaskFlow home"><span className="brand-mark"><Icon name="check" /></span><span>Task<span className="brand-accent">Flow</span></span></a>
        <button className="icon-button" onClick={() => setTheme((value) => value === 'light' ? 'dark' : 'light')} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} title="Toggle theme">
          {theme === 'light' ? <Icon name="moon" /> : <Icon name="sun" />}
        </button>
      </header>

      <main id="top" className="container">
        <section className="hero">
          <div><p className="eyebrow"><Icon name="sparkles" /> YOUR PERSONAL WORKSPACE</p><h1>Make space for<br /><span>what matters.</span></h1><p className="hero-copy">A calmer way to plan your day, keep your momentum, and get things done.</p></div>
          <div className="hero-note"><span className="note-dot" /><span>{counts.active === 0 ? 'You are all caught up.' : `${counts.active} ${counts.active === 1 ? 'task' : 'tasks'} in progress`}</span></div>
        </section>

        <section className="stats-grid" aria-label="Task summary">
          <StatCard label="Total tasks" value={counts.total} detail={counts.total ? 'Everything on your list' : 'Start with one small step'} tone="violet" icon={<Icon name="clipboard" />} />
          <StatCard label="Active" value={counts.active} detail={counts.active ? 'Keep the momentum going' : 'Nothing pending'} tone="blue" icon={<Icon name="circle" />} />
          <StatCard label="Completed" value={counts.completed} detail={counts.completed ? 'Nice work, keep it up' : 'Your wins will show here'} tone="green" icon={<Icon name="check" />} />
        </section>

        <section className="panel add-panel" aria-labelledby="create-heading">
          <div className="section-heading"><div><p className="section-kicker">NEW TASK</p><h2 id="create-heading">What needs doing?</h2></div><span className="keyboard-hint">Press <kbd>Enter</kbd> to add</span></div>
          <form onSubmit={addTask} className="task-form">
            <label className="sr-only" htmlFor="task-title">Task title</label>
            <input id="task-title" value={title} onChange={(event) => { setTitle(event.target.value); setError(''); }} placeholder="e.g. Prepare presentation slides" autoComplete="off" />
            <SelectControl label="Priority" value={priority} onChange={setPriority} />
            <label className="date-control"><span>Due date</span><input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></label>
            <button className="primary-button" type="submit"><Icon name="plus" /> Add task</button>
          </form>
          {error && <p className="form-error" role="alert">{error}</p>}
        </section>

        <section className="list-header">
          <div><p className="section-kicker">YOUR LIST</p><h2>Tasks <span className="count-pill">{visibleTasks.length}</span></h2></div>
          <nav className="filter-tabs" aria-label="Filter tasks">{filters.map((item) => <button key={item.id} className={filter === item.id ? 'active' : ''} onClick={() => setFilter(item.id)}>{item.label}{item.id === 'completed' && counts.completed > 0 && <span>{counts.completed}</span>}</button>)}</nav>
        </section>

        <section className="task-list" aria-live="polite">
          {visibleTasks.length === 0 ? <EmptyState filter={filter} /> : visibleTasks.map((task) => <TaskCard key={task.id} task={task} editing={editingId === task.id} editTitle={editTitle} setEditTitle={setEditTitle} editPriority={editPriority} setEditPriority={setEditPriority} editDueDate={editDueDate} setEditDueDate={setEditDueDate} onToggle={toggleTask} onDelete={deleteTask} onEdit={startEdit} onSave={saveEdit} onCancel={cancelEdit} />)}
        </section>

        <footer className="list-footer"><button className="clear-button" onClick={clearCompleted} disabled={!counts.completed}><Icon name="trash" /> Clear completed <span>({counts.completed})</span></button><p><span className="footer-dot" /> Autosaved locally</p></footer>
      </main>
    </div>
  );
}

function StatCard({ label, value, detail, tone, icon }) { return <article className={`stat-card ${tone}`}><div className="stat-icon">{icon}</div><div><p>{label}</p><strong>{value}</strong><small>{detail}</small></div></article>; }

function SelectControl({ label = 'Priority', value, onChange }) { return <label className="select-control"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{priorities.map((item) => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}</select></label>; }

function TaskCard({ task, editing, editTitle, setEditTitle, editPriority, setEditPriority, editDueDate, setEditDueDate, onToggle, onDelete, onEdit, onSave, onCancel }) {
  return <article className={`task-card ${task.completed ? 'is-complete' : ''} ${isOverdue(task) ? 'is-overdue' : ''}`}>
    <button className={`task-check ${task.completed ? 'checked' : ''}`} onClick={() => onToggle(task.id)} aria-label={task.completed ? `Mark ${task.title} active` : `Mark ${task.title} complete`}>{task.completed ? <Icon name="check" /> : <span />}</button>
    {editing ? <div className="edit-area"><input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} aria-label="Edit task title" autoFocus onKeyDown={(event) => { if (event.key === 'Enter') onSave(task.id); if (event.key === 'Escape') onCancel(); }} /><div className="edit-meta"><SelectControl value={editPriority} onChange={setEditPriority} /><label className="date-control"><span>Due date</span><input type="date" value={editDueDate} onChange={(event) => setEditDueDate(event.target.value)} /></label></div><div className="edit-actions"><button className="save-button" onClick={() => onSave(task.id)}><Icon name="check" /> Save</button><button className="cancel-button" onClick={onCancel}><Icon name="x" /> Cancel</button></div></div> : <><div className="task-content"><h3>{task.title}</h3><div className="task-meta"><span className={`priority-badge ${task.priority}`}>{task.priority}</span><span className={isOverdue(task) ? 'due-date overdue' : 'due-date'}>{task.dueDate ? (isOverdue(task) ? 'Overdue · ' : '') + formatDueDate(task.dueDate) : 'No due date'}</span></div></div><div className="task-actions"><button onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`} title="Edit task"><Icon name="edit" /></button><button onClick={() => onDelete(task.id)} aria-label={`Delete ${task.title}`} title="Delete task"><Icon name="trash" /></button></div></>}
  </article>;
}

function EmptyState({ filter }) { const copy = filter === 'completed' ? ['No completed tasks yet', 'Finish a task and it will appear here.'] : filter === 'active' ? ['You are all caught up', 'There are no active tasks right now.'] : ['Your list is clear', 'Add a task above to get started.']; return <div className="empty-state"><div className="empty-icon"><Icon name="check" /></div><h3>{copy[0]}</h3><p>{copy[1]}</p></div>; }

export default App;
