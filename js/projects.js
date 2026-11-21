/* ============================================================
   TaskFlow - projects.js
   Full project CRUD with progress bars and search.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  App.init('projects');
  renderProjects();
  $('#newProjectBtn').addEventListener('click', () => openProjectModal());
  App.bindSearch('#projectSearch', renderProjects);
  Notifications.greet();
});

function projectProgress(projectId) {
  const tasks = Storage.tasksForProject(projectId);
  if (!tasks.length) return 0;
  return Math.round(tasks.filter(t => t.status === 'completed').length / tasks.length * 100);
}

function renderProjects(filter) {
  filter = filter || '';
  const grid = $('#projectGrid');
  let projects = Storage.getProjects();
  if (filter) {
    projects = projects.filter(p =>
      p.name.toLowerCase().includes(filter) ||
      (p.description || '').toLowerCase().includes(filter));
  }
  if (!projects.length) {
    grid.innerHTML = '<div class="empty-state">No projects found. Click "+ New Project" to create one.</div>';
    return;
  }
  grid.innerHTML = projects.map(p => {
    const prog = projectProgress(p.id);
    return '<article class="card project-card">' +
      '<div class="card-head">' +
        '<h3>' + escapeHtml(p.name) + '</h3>' +
        '<span class="pill pill-' + p.status + '">' + projectStatusLabel(p.status) + '</span>' +
      '</div>' +
      '<p class="muted">' + escapeHtml(p.description || 'No description') + '</p>' +
      '<div class="progress"><div class="progress-bar" style="width:' + prog + '%"></div></div>' +
      '<div class="card-meta">' +
        '<span>🗓️ ' + formatDate(p.startDate) + ' → ' + formatDate(p.deadline) + '</span>' +
        '<span>' + prog + '%</span>' +
      '</div>' +
      '<div class="card-actions">' +
        '<button class="btn btn-ghost btn-sm" data-edit="' + p.id + '">Edit</button>' +
        '<button class="btn btn-danger btn-sm" data-del="' + p.id + '">Delete</button>' +
      '</div>' +
    '</article>';
  }).join('');

  $$('#projectGrid [data-edit]').forEach(b => b.addEventListener('click', () => openProjectModal(b.dataset.edit)));
  $$('#projectGrid [data-del]').forEach(b => b.addEventListener('click', () => deleteProject(b.dataset.del)));
}

function openProjectModal(id) {
  const p = id ? Storage.getProject(id) : null;
  const body =
    '<form id="projectForm" class="form">' +
      field('Project name', 'name', p ? p.name : '', 'text', true) +
      '<label class="form-field"><span>Description</span>' +
        '<textarea name="description" rows="3">' + (p ? escapeHtml(p.description) : '') + '</textarea></label>' +
      '<div class="form-row">' +
        '<label class="form-field"><span>Start date</span><input type="date" name="startDate" value="' + (p ? p.startDate : '') + '"></label>' +
        '<label class="form-field"><span>Deadline</span><input type="date" name="deadline" value="' + (p ? p.deadline : '') + '"></label>' +
      '</div>' +
      '<label class="form-field"><span>Status</span><select name="status">' +
        PROJECT_STATUSES.map(s =>
          '<option value="' + s + '"' + (p && p.status === s ? ' selected' : '') + '>' + projectStatusLabel(s) + '</option>').join('') +
      '</select></label>' +
      '<div class="form-actions">' +
        '<button type="button" class="btn btn-ghost" data-close>Cancel</button>' +
        '<button type="submit" class="btn btn-primary">Save Project</button>' +
      '</div>' +
    '</form>';
  openModal(p ? 'Edit Project' : 'New Project', body);

  $('#projectForm').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get('name').trim();
    if (!name) { showToast('Project name is required', 'error'); return; }
    const projects = Storage.getProjects();
    if (p) {
      const i = projects.findIndex(x => x.id === id);
      projects[i] = Object.assign({}, projects[i], {
        name: name,
        description: fd.get('description'),
        startDate: fd.get('startDate'),
        deadline: fd.get('deadline'),
        status: fd.get('status')
      });
      Storage.saveProjects(projects);
      Storage.addActivity('Project updated: ' + name, 'info');
      showToast('Project updated', 'success');
    } else {
      projects.push({
        id: Storage.uid('p'), name: name, description: fd.get('description'),
        startDate: fd.get('startDate'), deadline: fd.get('deadline'),
        status: fd.get('status'), createdAt: new Date().toISOString()
      });
      Storage.saveProjects(projects);
      Storage.addActivity('Project created: ' + name, 'success');
      showToast('Project created', 'success');
    }
    closeModal();
    renderProjects($('#projectSearch').value.trim().toLowerCase());
  });
}

function deleteProject(id) {
  const p = Storage.getProject(id);
  if (!p) return;
  if (!confirm('Delete project "' + p.name + '"? All of its tasks will also be deleted.')) return;
  Storage.saveProjects(Storage.getProjects().filter(x => x.id !== id));
  Storage.saveTasks(Storage.getTasks().filter(t => t.projectId !== id));
  Storage.addActivity('Project deleted: ' + p.name, 'danger');
  showToast('Project deleted', 'success');
  renderProjects();
}
