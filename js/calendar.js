/* ============================================================
   TaskFlow - calendar.js
   Monthly calendar with task due dates, overdue highlighting,
   previous / next / today navigation.
   ============================================================ */

let viewYear, viewMonth;

document.addEventListener('DOMContentLoaded', () => {
  App.init('calendar');
  const now = new Date();
  viewYear = now.getFullYear();
  viewMonth = now.getMonth();
  $('#calPrev').addEventListener('click', () => { viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } renderCalendar(); });
  $('#calNext').addEventListener('click', () => { viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } renderCalendar(); });
  $('#calToday').addEventListener('click', () => {
    const n = new Date();
    viewYear = n.getFullYear(); viewMonth = n.getMonth();
    renderCalendar();
  });
  renderCalendar();
  Notifications.greet();
});

function renderCalendar() {
  $('#calTitle').textContent = new Date(viewYear, viewMonth).toLocaleDateString(
    undefined, { month: 'long', year: 'numeric' });

  const first = new Date(viewYear, viewMonth, 1);
  const startDay = (first.getDay() + 6) % 7;      // Monday-first layout
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const today = todayStr();
  const tasks = Storage.getTasks();

  let html = '';
  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(d => {
    html += '<div class="cal-weekday">' + d + '</div>';
  });
  for (let i = 0; i < startDay; i++) html += '<div class="cal-cell cal-empty"></div>';

  for (let day = 1; day <= daysInMonth; day++) {
    const iso = viewYear + '-' + String(viewMonth + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
    const dayTasks = tasks.filter(t => t.dueDate === iso);
    html += '<div class="cal-cell' + (iso === today ? ' cal-today' : '') + '">' +
      '<span class="cal-day">' + day + '</span>' +
      dayTasks.map(t => {
        const overdue = isOverdue(t);
        return '<div class="cal-task status-' + t.status + (overdue ? ' cal-overdue' : '') +
          '" title="' + escapeHtml(t.title) + '">' + escapeHtml(t.title) + '</div>';
      }).join('') +
    '</div>';
  }
  $('#calGrid').innerHTML = html;
}
