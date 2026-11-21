/* ============================================================
   TaskFlow - tasks.js
   Kanban board with drag & drop, search, filters,
   full task CRUD via modal.
   ============================================================ */

const filters = { q: '', priority: '', project: '' };

document.addEventListener('DOMContentLoaded', () => {
  App.init('tasks');
  populateProjectFilter();
  renderBoard();
  $('#newTaskBtn').addEventListener('click', () => openTaskModal());
  App.bindSearch('#taskSearch', v => { filters.q = v; renderBoard(); });
  $('#priorityFilter').addEventListener('change', e => { filters.priority = e.target.value; renderBoard(); });
  $('#projectFilter').addEventListener('change', e => { filters.project = e.target.value; renderBoard(); });
  $('#clearFilters').addEventListener('click', () => {
    filters.q = ''; filters.priority = ''; filters.project = '';
    $('#taskSearch').value = '';
    $('#priorityFilter').value = '';
    $('#projectFilter').value = '';
    renderBoard();
  });
  Notifications.greet();
});

function populateProjectFilter() {
  const sel = $('#projectFilter');
  sel.innerHTML = '<option value="">All projects</option>' +
    Storage.getProjects().map(p =>
      '<option value="' + p.id + '">' + escapeHtml(p.name) + '</option>').join('');
}

function filteredTasks() {
  return Storage.getTasks().filter(t => {
    if (filters.q &&
        !t.title.toLowerCase().includes(filters.q) &&
        !(t.description || '').toLowerCase().includes(filters.q)) return false;
    if (filters.priority && t.priority !== filters.priority) return false;
    if (filters.project && t.projectId !== filters.project) return false;
    return true;
  });
}

function taskCard(t) {
  const overdue = isOverdue(t);
  return '<div class="task-card" draggable="true" data-id="' + t.id + '">' +
    '<div class="task-card-head">' +
      '<span class="pill ' + priorityClass(t.priority) + '">' + t.priority + '</span>' +
      (overdue ? '<span class="pill pill-danger">overdue</span>' : '') +
    '</div>' +
    '<h4>' + escapeHtml(t.title) + '</h4>' +
    '<p class="muted small">' + escapeHtml(t.description || '') + '</p>' +
    '<div class="task-card-foot">' +
      '<span>📁 ' + escapeHtml(projectName(t.projectId)) + '</span>' +
      '<span class="' + (overdue ? 'text-danger' : '') + '">📅 ' + formatDate(t.dueDate) + '</span>' +
    '</div>' +
    '<div class="task-card-actions">' +
      '<button class="btn btn-ghost btn-sm" data-edit="' + t.id + '">Edit</button>' +
      '<button class="btn btn-danger btn-sm" data-del="' + t.id + '">Delete</button>' +
    '</div>' +
  '</div>';
}

function renderBoard() {
  const tasks = filteredTasks();
  STATUSES.forEach(status => {
    const list = $('#col-' + status + ' .kanban-list');
    const items = tasks.filter(t => t.status === status);
    list.innerHTML = items.length
      ? items.map(taskCard).join('')
      : '<div class="kanban-empty">No tasks here</div>';
    $('#col-' + status + ' .col-count').textContent = items.length;
  });

  $$('.task-card [data-edit]').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    openTaskModal(b.dataset.edit);
  }));
  $$('.task-card [data-del]').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    if (!confirm('Delete this task?')) return;
    const t = Storage.getTask(b.dataset.del);
    Storage.saveTasks(Storage.getTasks().filter(x => x.id !== b.dataset.del));
    Storage.addActivity('Task deleted: ' + t.title, 'danger');
    showToast('Task deleted', 'success');
    renderBoard();
  }));

  bindDrag();
}

/* ---------------- HTML5 Drag & Drop ---------------- */
function bindDrag() {
  $$('.task-card').forEach(card => {
    card.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', card.dataset.id);
      e.dataTransfer.effectAllowed = 'move';
      card.classList.add('dragging');
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));
  });

  $$('.kanban-list').forEach(list => {
    list.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      list.classList.add('drag-over');
    });
    list.addEventListener('dragleave', () => list.classList.remove('drag-over'));
    list.addEventListener('drop', e => {
      e.preventDefault();
      list.classList.remove('drag-over');
      const id = e.dataTransfer.getData('text/plain');
      const newStatus = list.closest('.kanban-col').dataset.status;
      const tasks = Storage.getTasks();
      const task = tasks.find(t => t.id === id);
      if (!task || task.status === newStatus) return;
      task.status = newStatus;
      Storage.saveTasks(tasks);
      Storage.addActivity('Task "' + task.title + '" moved to ' + statusLabel(newStatus),
        newStatus === 'completed' ? 'success' : 'info');
      if (newStatus === 'completed') showToast('Task completed. Nice work! 🎉', 'success');
      renderBoard();
    });
  });
}

/* ---------------- Task modal (create / edit) ---------------- */
function openTaskModal(id) {
  const t = id ? Storage.getTask(id) : null;
  const projects = Storage.getProjects();
  if (!projects.length) {
    showToast('Create a project first, then add tasks to it.', 'error');
    return;
  }
  const body =
    '<form id="taskForm" class="form">' +
      field('Task title', 'title', t ? t.title : '', 'text', true) +
      '<label class="form-field"><span>Description</span>' +
        '<textarea name="description" rows="3">' + (t ? escapeHtml(t.description) : '') + '</textarea></label>' +
      '<div class="form-row">' +
        '<label class="form-field"><span>Project</span><select name="projectId">' +
          projects.map(p =>
            '<option value="' + p.id + '"' + (t && t.projectId === p.id ? ' selected' : '') + '>' +
            escapeHtml(p.name) + '</option>').join('') +
        '</select></label>' +
        '<label class="form-field"><span>Priority</span><select name="priority">' +
          PRIORITIES.map(pr =>
            '<option value="' + pr + '"' + (t && t.priority === pr ? ' selected' : '') + '>' +
            pr.charAt(0).toUpperCase() + pr.slice(1) + '</option>').join('') +
        '</select></label>' +
      '</div>' +
      '<div class="form-row">' +
        '<label class="form-field"><span>Due date</span><input type="date" name="dueDate" value="' + (t ? t.dueDate : '') + '"></label>' +
        '<label class="form-field"><span>Status</span><select name="status">' +
          STATUSES.map(s =>
            '<option value="' + s + '"' + (t && t.status === s ? ' selected' : '') + '>' +
            statusLabel(s) + '</option>').join('') +
        '</select></label>' +
      '</div>' +
      '<div class="form-actions">' +
        '<button type="button" class="btn btn-ghost" data-close>Cancel</button>' +
        '<button type="submit" class="btn btn-primary">Save Task</button>' +
      '</div>' +
    '</form>';
  openModal(t ? 'Edit Task' : 'New Task', body, true);

  $('#taskForm').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const title = fd.get('title').trim();
    if (!title) { showToast('Task title is required', 'error'); return; }
    const tasks = Storage.getTasks();
    const data = {
      title: title,
      description: fd.get('description'),
      projectId: fd.get('projectId'),
      priority: fd.get('priority'),
      dueDate: fd.get('dueDate'),
      status: fd.get('status')
    };
    if (t) {
      const i = tasks.findIndex(x => x.id === id);
      tasks[i] = Object.assign({}, tasks[i], data);
      Storage.addActivity('Task updated: ' + title, 'info');
      showToast('Task updated', 'success');
    } else {
      data.id = Storage.uid('t');
      data.createdAt = new Date().toISOString();
      tasks.push(data);
      Storage.addActivity('Task created: ' + title, 'success');
      showToast('Task created', 'success');
    }
    Storage.saveTasks(tasks);
    closeModal();
    renderBoard();
  });
}
