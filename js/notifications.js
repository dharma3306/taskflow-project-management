/* ============================================================
   TaskFlow - notifications.js
   Notification centre: overdue task alerts + upcoming
   deadline reminders. Rendered into the topbar panel.
   ============================================================ */

const Notifications = {
  items() {
    const tasks = Storage.getTasks();
    const items = [];
    tasks.filter(isOverdue).forEach(t => items.push({
      icon: '🔴', type: 'danger', time: t.dueDate,
      text: '"' + t.title + '" is overdue (was due ' + formatDate(t.dueDate) + ')'
    }));
    tasks
      .filter(t => t.status !== 'completed' && t.dueDate && !isOverdue(t) && daysUntil(t.dueDate) <= 2)
      .forEach(t => items.push({
        icon: '⏰', type: 'warning', time: t.dueDate,
        text: '"' + t.title + '" is due ' + formatDate(t.dueDate)
      }));
    return items;
  },

  renderPanel() {
    const panel = $('#notifPanel');
    const badge = $('#notifBadge');
    if (!panel || !badge) return;
    const items = this.items();
    badge.textContent = items.length;
    badge.style.display = items.length ? 'inline-flex' : 'none';
    panel.innerHTML = items.length
      ? items.map(i =>
          '<div class="notif-item notif-' + i.type + '">' +
            '<span class="notif-icon">' + i.icon + '</span>' +
            '<div><p>' + escapeHtml(i.text) + '</p><small>' + formatDate(i.time) + '</small></div>' +
          '</div>').join('')
      : '<p class="empty-state">You are all caught up 🎉</p>';
  },

  /* one-time alert when a page loads */
  greet() {
    const items = this.items();
    if (items.length) {
      showToast(items.length + ' task(s) need your attention', 'warning');
    }
  }
};
