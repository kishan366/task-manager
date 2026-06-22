let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const categorySelect = document.getElementById('category-select');
const clearAllBtn = document.getElementById('clear-all-btn');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const pendingCount = document.getElementById('pending-count');
const completedCount = document.getElementById('completed-count');

function getCategoryIcon(category) {
  if (category === 'Work') return '<i class="ri-briefcase-line"></i>';
  if (category === 'Personal') return '<i class="ri-home-4-line"></i>';
  if (category === 'Urgent') return '<i class="ri-error-warning-line"></i>';
  return '';
}

function renderTasks() {
  if (tasks.length === 0) {
    taskList.style.display = 'none';
    emptyState.style.display = 'block';
  } else {
    taskList.style.display = 'block';
    emptyState.style.display = 'none';
  }

  const fragment = document.createDocumentFragment();
  taskList.innerHTML = '';

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const li = document.createElement('li');
    
    if (task.completed) {
      li.className = 'task-item completed';
    } else {
      li.className = 'task-item';
    }
    
    li.setAttribute('data-id', task.id);
    li.id = 'task-node-' + task.id;

    const checkedAttribute = task.completed ? 'checked' : '';
    const categoryIcon = getCategoryIcon(task.category);

    li.innerHTML = `
      <div class="task-content-left">
        <input type="checkbox" class="task-checkbox" ${checkedAttribute}>
        <span class="task-text">${task.title}</span>
        <span class="task-tag">${categoryIcon} ${task.category}</span>
      </div>
      <button class="delete-btn"><i class="ri-delete-bin-line"></i></button>
    `;
    fragment.appendChild(li);
  }

  taskList.appendChild(fragment);
  updateMetrics();
}

function updateMetrics() {
  let pending = 0;
  let completed = 0;

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].completed) {
      completed++;
    } else {
      pending++;
    }
  }
  
  pendingCount.textContent = pending;
  completedCount.textContent = completed;
  
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

taskForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (title === '') return;

  const newTask = {
    id: Date.now().toString(),
    title: title,
    category: categorySelect.value,
    completed: false
  };

  tasks.push(newTask);
  taskForm.reset();
  renderTasks();
});

taskList.addEventListener('click', function(e) {
  const taskItem = e.target.closest('.task-item');
  if (!taskItem) return;
  
  const taskId = taskItem.getAttribute('data-id');

  if (e.target.classList.contains('task-checkbox')) {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id === taskId) {
        tasks[i].completed = e.target.checked;
      }
    }
    if (e.target.checked) {
      taskItem.classList.add('completed');
    } else {
      taskItem.classList.remove('completed');
    }
    updateMetrics();
  } 
  
  if (e.target.closest('.delete-btn')) {
    const newTasks = [];
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id !== taskId) {
        newTasks.push(tasks[i]);
      }
    }
    tasks = newTasks;
    renderTasks();
  }
});



clearAllBtn.addEventListener('click', function() {
  if (confirm('Are you sure you want to clear all tasks?')) {
    tasks = [];
    renderTasks();
  }
});

renderTasks();