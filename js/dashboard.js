/* ============================================================
   TaskFlow - dashboard.js
   KPI cards, completion ring, Chart.js analytics,
   recent activity feed.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  App.init('dashboard');
  renderStats();
  renderActivity();
  renderCharts();
  Notifications.greet();
});

function computeStats() {
  const projects = Storage.getProjects();
  const tasks = Storage.getTasks();
  const done = tasks.filter(t => t.status === 'completed');
  return {
    projects: projects.length,
    tasks: tasks.length,
    completed: done.length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    todo: tasks.filter(t => t.status === 'todo').length,
    overdue: tasks.filter(isOverdue).length,
    pct: tasks.length ? Math.round(done.length / tasks.length * 100) : 0
  };
}

function renderStats() {
  const s = computeStats();
  $('#statProjects').textContent = s.projects;
  $('#statTasks').textContent = s.tasks;
  $('#statCompleted').textContent = s.completed;
  $('#statInProgress').textContent = s.inProgress;
  $('#statTodo').textContent = s.todo;
  $('#statOverdue').textContent = s.overdue;
  const ring = $('#completionRing');
  if (ring) {
    ring.style.background = 'conic-gradient(var(--primary) ' + (s.pct * 3.6) + 'deg, var(--border) 0deg)';
    ring.querySelector('span').textContent = s.pct + '%';
  }
}

function renderActivity() {
  const list = $('#activityList');
  const items = Storage.getActivities().slice(0, 8);
  if (!items.length) {
    list.innerHTML = '<p class="empty-state">No recent activity yet.</p>';
    return;
  }
  list.innerHTML = items.map(a =>
    '<div class="activity-item activity-' + a.type + '">' +
      '<span class="activity-dot"></span>' +
      '<div><p>' + escapeHtml(a.text) + '</p>' +
      '<small>' + new Date(a.time).toLocaleString() + '</small></div>' +
    '</div>').join('');
}

function renderCharts() {
  if (typeof Chart === 'undefined') return; // CDN offline - charts skipped gracefully
  const tasks = Storage.getTasks();
  const statusCounts = STATUSES.map(st => tasks.filter(t => t.status === st).length);
  const prioCounts = PRIORITIES.map(p => tasks.filter(t => t.priority === p).length);

  const doughnut = $('#statusChart');
  if (doughnut) {
    new Chart(doughnut, {
      type: 'doughnut',
      data: {
        labels: ['To Do', 'In Progress', 'Completed'],
        datasets: [{
          data: statusCounts,
          backgroundColor: ['#94a3b8', '#3b82f6', '#10b981'],
          borderWidth: 0
        }]
      },
      options: { plugins: { legend: { position: 'bottom' } }, cutout: '62%' }
    });
  }

  const bar = $('#priorityChart');
  if (bar) {
    new Chart(bar, {
      type: 'bar',
      data: {
        labels: PRIORITIES.map(p => p.charAt(0).toUpperCase() + p.slice(1)),
        datasets: [{
          data: prioCounts,
          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
          borderRadius: 6
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
  }
}
