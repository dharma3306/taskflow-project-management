/* ============================================================
   TaskFlow - storage.js
   Central data layer. All app data persists in the browser
   via Local Storage. Every other module talks to Storage.
   ============================================================ */

const STORAGE_KEYS = {
  PROJECTS: 'taskflow_projects',
  TASKS: 'taskflow_tasks',
  ACTIVITIES: 'taskflow_activities',
  SETTINGS: 'taskflow_settings'
};

const Storage = {
  read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      console.error('Storage read error:', err);
      return fallback;
    }
  },

  write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  uid(prefix) {
    return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  },

  /* ---------------- Projects ---------------- */
  getProjects() { return this.read(STORAGE_KEYS.PROJECTS, []); },
  saveProjects(projects) { this.write(STORAGE_KEYS.PROJECTS, projects); },
  getProject(id) { return this.getProjects().find(p => p.id === id); },

  /* ---------------- Tasks ---------------- */
  getTasks() { return this.read(STORAGE_KEYS.TASKS, []); },
  saveTasks(tasks) { this.write(STORAGE_KEYS.TASKS, tasks); },
  getTask(id) { return this.getTasks().find(t => t.id === id); },
  tasksForProject(projectId) { return this.getTasks().filter(t => t.projectId === projectId); },

  /* ---------------- Activity log ---------------- */
  getActivities() { return this.read(STORAGE_KEYS.ACTIVITIES, []); },
  addActivity(text, type = 'info') {
    const items = this.getActivities();
    items.unshift({ id: this.uid('act'), text: text, type: type, time: new Date().toISOString() });
    this.write(STORAGE_KEYS.ACTIVITIES, items.slice(0, 60));
  },

  /* ---------------- Settings ---------------- */
  getSettings() {
    return this.read(STORAGE_KEYS.SETTINGS, { theme: 'light', notifications: true });
  },
  saveSettings(settings) { this.write(STORAGE_KEYS.SETTINGS, settings); },

  clearAll() {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  },

  /* ---------------- Demo data (first run only) ---------------- */
  seedIfEmpty() {
    if (localStorage.getItem(STORAGE_KEYS.PROJECTS)) return;
    const d = offset => {
      const date = new Date();
      date.setDate(date.getDate() + offset);
      return date.toISOString().slice(0, 10);
    };
    const now = new Date().toISOString();
    const projects = [
      { id: 'p_demo1', name: 'Website Redesign', description: 'Modernise the company website with a fresh UI and improved performance.', startDate: d(-20), deadline: d(10), status: 'active', createdAt: now },
      { id: 'p_demo2', name: 'Mobile App MVP', description: 'Build the first MVP of the TaskFlow mobile companion app.', startDate: d(-5), deadline: d(40), status: 'planning', createdAt: now },
      { id: 'p_demo3', name: 'Q4 Marketing Campaign', description: 'Plan and launch the end-of-year marketing campaign.', startDate: d(-30), deadline: d(-2), status: 'on-hold', createdAt: now }
    ];
    const tasks = [
      { id: 't_demo1', projectId: 'p_demo1', title: 'Create homepage mockups', description: 'Design three homepage concepts in Figma.', priority: 'high', dueDate: d(2), status: 'in-progress', createdAt: now },
      { id: 't_demo2', projectId: 'p_demo1', title: 'Set up analytics', description: 'Integrate Google Analytics 4 and define conversion events.', priority: 'medium', dueDate: d(5), status: 'todo', createdAt: now },
      { id: 't_demo3', projectId: 'p_demo1', title: 'Content audit', description: 'Review and migrate existing content.', priority: 'low', dueDate: d(-1), status: 'todo', createdAt: now },
      { id: 't_demo4', projectId: 'p_demo2', title: 'Define MVP feature list', description: 'Agree the MVP feature list with stakeholders.', priority: 'critical', dueDate: d(7), status: 'in-progress', createdAt: now },
      { id: 't_demo5', projectId: 'p_demo2', title: 'Competitor research', description: 'Analyse three competing products.', priority: 'medium', dueDate: d(-3), status: 'todo', createdAt: now },
      { id: 't_demo6', projectId: 'p_demo3', title: 'Draft campaign brief', description: 'Write the creative brief for the Q4 campaign.', priority: 'high', dueDate: d(-1), status: 'completed', createdAt: now },
      { id: 't_demo7', projectId: 'p_demo1', title: 'Choose colour palette', description: 'Pick the brand palette and typography scale.', priority: 'medium', dueDate: d(-10), status: 'completed', createdAt: now }
    ];
    const activities = [
      { id: 'act_1', text: 'Welcome to TaskFlow! Demo project data has been loaded for you.', type: 'info', time: now }
    ];
    this.write(STORAGE_KEYS.PROJECTS, projects);
    this.write(STORAGE_KEYS.TASKS, tasks);
    this.write(STORAGE_KEYS.ACTIVITIES, activities);
  }
};
