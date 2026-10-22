// TodoMVC markup/styles with server-backed persistence for the cross-device case.
const [, mode, workspace] = location.pathname.split('/');
const api = `/api/workspaces/${encodeURIComponent(workspace)}/todos`;
const list = document.querySelector('.todo-list');
const input = document.querySelector('.new-todo');
const errorBox = document.querySelector('#error');
document.querySelector('#heading').textContent =
  mode === 'admin' ? 'todo admin' : 'todos';
document.querySelector('#workspace').textContent =
  `Shared workspace: ${workspace}`;
let state = { version: -1, todos: [] };
let filter = 'all';
let editing = false;
let polling = false;

async function request(path, options) {
  const response = await fetch(path, {
    ...options,
    signal: AbortSignal.timeout(10000),
    headers: { 'content-type': 'application/json' },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
  return data;
}
function showError(error) {
  errorBox.hidden = false;
  errorBox.textContent = String(error.message || error);
}
async function refresh() {
  const next = await request(api);
  if (next.version > state.version && !editing) {
    state = next;
    render();
  }
  errorBox.hidden = true;
}
async function mutate(path, method, data) {
  await request(path, {
    method,
    ...(data === undefined ? {} : { body: JSON.stringify(data) }),
  });
  await refresh();
}
function render() {
  list.replaceChildren();
  for (const todo of state.todos) {
    if (
      (filter === 'active' && todo.completed) ||
      (filter === 'completed' && !todo.completed)
    )
      continue;
    const row = document.createElement('li');
    row.dataset.id = todo.id;
    row.classList.toggle('completed', todo.completed);
    const view = document.createElement('div');
    view.className = 'view';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'toggle';
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-label', `Complete ${todo.title}`);
    checkbox.addEventListener('change', () => {
      checkbox.disabled = true;
      mutate(`${api}/${todo.id}`, 'PATCH', {
        completed: checkbox.checked,
      }).catch((error) => {
        checkbox.disabled = false;
        showError(error);
      });
    });
    const label = document.createElement('label');
    label.textContent = todo.title;
    label.addEventListener('dblclick', () => {
      editing = true;
      row.classList.add('editing');
      const edit = document.createElement('input');
      edit.className = 'edit';
      edit.value = todo.title;
      edit.setAttribute('aria-label', 'Edit todo');
      row.append(edit);
      let saved = false;
      const save = async (cancel = false) => {
        if (saved) return;
        saved = true;
        editing = false;
        try {
          if (!cancel) {
            if (edit.value.trim())
              await mutate(`${api}/${todo.id}`, 'PATCH', { title: edit.value });
            else await mutate(`${api}/${todo.id}`, 'DELETE');
          }
          render();
        } catch (error) {
          showError(error);
          render();
        }
      };
      edit.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') void save();
        if (event.key === 'Escape') void save(true);
      });
      edit.addEventListener('blur', () => void save());
      edit.focus();
    });
    const remove = document.createElement('button');
    remove.className = 'destroy';
    remove.setAttribute('aria-label', `Delete ${todo.title}`);
    remove.addEventListener('click', () =>
      mutate(`${api}/${todo.id}`, 'DELETE').catch(showError),
    );
    view.append(checkbox, label, remove);
    row.append(view);
    list.append(row);
  }
  const remaining = state.todos.filter((todo) => !todo.completed).length;
  document.querySelector('.todo-count').textContent =
    `${remaining} item${remaining === 1 ? '' : 's'} left`;
  document.querySelector('.clear-completed').hidden = !state.todos.some(
    (todo) => todo.completed,
  );
  document
    .querySelectorAll('[data-filter]')
    .forEach((link) =>
      link.classList.toggle('selected', link.dataset.filter === filter),
    );
}
input.addEventListener('keydown', async (event) => {
  if (event.key !== 'Enter' || !input.value.trim() || input.disabled) return;
  input.disabled = true;
  try {
    await mutate(api, 'POST', { title: input.value });
    input.value = '';
  } catch (error) {
    showError(error);
  } finally {
    input.disabled = false;
    input.focus();
  }
});
document
  .querySelector('.clear-completed')
  .addEventListener('click', async () => {
    try {
      for (const todo of state.todos.filter((item) => item.completed))
        await request(`${api}/${todo.id}`, { method: 'DELETE' });
      await refresh();
    } catch (error) {
      showError(error);
    }
  });
function selectFilter() {
  filter =
    location.hash === '#/active'
      ? 'active'
      : location.hash === '#/completed'
        ? 'completed'
        : 'all';
  render();
}
window.addEventListener('hashchange', selectFilter);
selectFilter();
void refresh().catch(showError);
const timer = setInterval(async () => {
  if (polling || editing) return;
  polling = true;
  try {
    await refresh();
  } catch (error) {
    showError(error);
  } finally {
    polling = false;
  }
}, 500);
window.addEventListener('pagehide', () => clearInterval(timer));
