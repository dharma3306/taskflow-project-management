/* ============================================================
   TaskFlow - app.js
   Shared helpers, layout wiring, theme, modals and toasts.
   Loaded on every page after storage.js.
   ============================================================ */

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const PRIORITIES = ['low', 'medium', 'high', 'critical'];
const STATUSES = ['todo', 'in-progress', 'completed'];
const PROJECT_STATUSES = ['planning', 'active', 'on-hold', 'completed'];

function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g,
    ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso + 'T00:00:00').toLocaleDateString(undefined,
    { day: 'numeric', month: 'short', year: 'numeric' });
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function daysUntil(iso) {
  const now = new Date(todayStr() + 'T00:00:00');
  const then = new Date(iso + 'T00:00:00');
  return Math.round((then - now) / 86400000);
}

function priorityClass(p) { return 'priority-' + p; }
function statusLabel(s) {
  return ({ 'todo': 'To Do', 'in-progress': 'In Progress', 'completed': 'Completed' })[s] || s;
}
function projectStatusLabel(s) {
  return ({ 'planning': 'Planning', 'active': 'Active', 'on-hold': 'On Hold', 'completed': 'Completed' })[s] || s;
}
function projectName(id) {
  const p = Storage.getProject(id);
  return p ? p.name : '—';
}
function isOverdue(task) {
  return task.status !== 'completed' && task.dueDate && task.dueDate < todayStr();
}

/* Reusable form field renderer (used by project & task modals) */
function field(label, name, value, type, required) {
  return '<label class="form-field"><span>' + label + (required ? ' *' : '') + '</span>' +
    '<input type="' + (type || 'text') + '" name="' + name + '" value="' + escapeHtml(value) + '"' + (required ? ' required' : '') + '></label>';
}

/* ---------------- Toast notifications ---------------- */
function showToast(message, type) {
  type = type || 'info';
  let wrap = $('#toastWrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'toastWrap';
    document.body.appendChild(wrap);
  }
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.textContent = message;
  wrap.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 3200);
}

/* ---------------- Modal ---------------- */
function openModal(title, bodyHTML, wide) {
  closeModal();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'appModal';
  overlay.innerHTML =
    '<div class="modal' + (wide ? ' modal-wide' : '') + '">' +
      '<div class="modal-header">' +
        '<h3>' + title + '</h3>' +
        '<button type="button" class="icon-btn" data-close aria-label="Close">&times;</button>' +
      '</div>' +
      '<div class="modal-body">' + bodyHTML + '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => {
    if (e.target === overlay || e.target.closest('[data-close]')) closeModal();
  });
  document.addEventListener('keydown', escClose);
  const first = overlay.querySelector('input, textarea, select');
  if (first) first.focus();
  return overlay;
}

function escClose(e) { if (e.key === 'Escape') closeModal(); }

function closeModal() {
  const modal = $('#appModal');
  if (modal) modal.remove();
  document.removeEventListener('keydown', escClose);
}

/* ---------------- App controller ---------------- */
const App = {
  init(page) {
    Storage.seedIfEmpty();
    this.applyTheme();
    this.highlightNav(page);
    this.wireTopbar();
    Notifications.renderPanel();
  },

  applyTheme() {
    const theme = Storage.getSettings().theme || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    const btn = $('#themeToggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  },

  setTheme(theme) {
    Storage.saveSettings(Object.assign({}, Storage.getSettings(), { theme: theme }));
    this.applyTheme();
  },

  toggleTheme() {
    const next = Storage.getSettings().theme === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
    showToast(next === 'dark' ? 'Dark mode enabled' : 'Light mode enabled', 'info');
  },

  highlightNav(page) {
    $$('.nav-link').forEach(link => link.classList.toggle('active', link.dataset.page === page));
  },

  wireTopbar() {
    const themeBtn = $('#themeToggle');
    if (themeBtn) themeBtn.addEventListener('click', () => this.toggleTheme());
    const notifBtn = $('#notifBtn');
    if (notifBtn) notifBtn.addEventListener('click', () => {
      Notifications.renderPanel();
      $('#notifPanel').classList.toggle('open');
    });
    document.addEventListener('click', e => {
      const panel = $('#notifPanel');
      if (panel && panel.classList.contains('open') && !e.target.closest('.notif-wrap')) {
        panel.classList.remove('open');
      }
    });
    const menuBtn = $('#menuBtn');
    if (menuBtn) menuBtn.addEventListener('click', () => $('.sidebar').classList.toggle('open'));
  },

  bindSearch(inputSel, onChange) {
    const input = $(inputSel);
    if (input) input.addEventListener('input', () => onChange(input.value.trim().toLowerCase()));
  }
};
