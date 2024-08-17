// Elements
const tasksList = document.querySelector("#tasks-list");
const addTaskForm = document.querySelector("form#add-task");
const addTaskInput = document.querySelector("#add-task-input");
const clearAllTasksBtn = document.querySelector("button#clear-all-tasks");

// Total List Of Tasks
let list = JSON.parse(localStorage.getItem("tasks")) || [];

/**
 * Show All Tasks From Local Storage In Page
 */
function showTasksList() {
  tasksList.innerHTML = "";
  const list = JSON.parse(localStorage.getItem("tasks")) || [];

  if (list.length === 0) {
    clearAllTasksBtn.disabled = true;

    const element = `
      <div class="ui icon warning message">
        <i class="inbox icon"></i>
        <div class="content">
          <div class="header">You have no tasks today!</div>
          <div>Enter your tasks today above.</div>
        </div>
      </div>
    `;

    tasksList.style.border = "none";
    return tasksList.insertAdjacentHTML("beforeend", element);
  }

  clearAllTasksBtn.disabled = false;
  tasksList.style.border = "1px solid rgba(34,36,38,.15)";
  list.reverse().forEach(task => {
    const element = `
      <li class="ui segment grid equal width">
        <div class="ui checkbox column">
          <input type="checkbox" ${task.completed ? "checked" : ""} data-id="${task.id}">
          <label>${task.text}</label>
        </div>
        <div class="column">
          <i data-id="${task.id}" class="edit outline icon"></i>
          <i data-id="${task.id}" class="trash alternate outline remove icon"></i>
        </div>
      </li>
    `;

    tasksList.insertAdjacentHTML("beforeend", element);
  });

  // Debug: Log list to see if tasks are rendered correctly
  console.log("Rendered Task List:", list);

  // Add event listeners for task completion
  document.querySelectorAll('li input[type="checkbox"]').forEach(item => {
    item.addEventListener("change", e => {
      completeTask(parseInt(e.target.dataset.id, 10));
    });
  });

  // Add event listeners for editing tasks
  document.querySelectorAll('li i.edit').forEach(item => {
    item.addEventListener("click", e => {
      e.stopPropagation();
      showEditModal(parseInt(e.target.dataset.id, 10));
    });
  });

  // Add event listeners for removing tasks
  document.querySelectorAll('li i.trash').forEach(item => {
    item.addEventListener("click", e => {
      e.stopPropagation();
      showRemoveModal(parseInt(e.target.dataset.id, 10));
    });
  });
}

/**
 * Add new task to local storage
 */
function addTask(event) {
  event.preventDefault();

  const taskText = addTaskInput.value;
  if (taskText.trim().length === 0) {
    return (addTaskInput.value = "");
  }

  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false,
  };

  list.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(list));
  addTaskInput.value = "";

  showNotification("success", "Task was successfully added");
  showTasksList();
}

// Change Complete State
function completeTask(id) {
  // Debug: Log the task ID to ensure the correct task is being toggled
  console.log("Toggling completion state for task ID:", id);

  // Get Task
  const taskIndex = list.findIndex(t => t.id === id);
  const task = list[taskIndex];

  // Debug: Log the current task completion state
  console.log("Current completion state:", task.completed);

  // Change State
  task.completed = !task.completed;

  // Debug: Log the new task completion state
  console.log("New completion state:", task.completed);

  list[taskIndex] = task;

  // Save Changes
  localStorage.setItem("tasks", JSON.stringify(list));
  showTasksList();
}

/**
 * Remove task
 */
function removeTask(id) {
  list = list.filter(t => t.id !== id);
  localStorage.setItem("tasks", JSON.stringify(list));

  showNotification("error", "Task was successfully deleted");
  showTasksList();
}

/**
 * Edit task
 */
function editTask(id) {
  const taskText = document.querySelector("#task-text").value;

  if (taskText.trim().length === 0) return;
  const taskIndex = list.findIndex(t => t.id === id);

  list[taskIndex].text = taskText;
  localStorage.setItem("tasks", JSON.stringify(list));

  showNotification("success", "Task was successfully updated");
  showTasksList();
}

// Clear All Tasks
function clearAllTasks() {
  if (list.length > 0) {
    list = [];
    localStorage.setItem("tasks", JSON.stringify(list));
    return showTasksList();
  }

  new Noty({
    type: "error",
    text: '<i class="close icon"></i> There is no task to remove.',
    layout: "bottomRight",
    timeout: 2000,
    progressBar: true,
    closeWith: ["click"],
    theme: "metroui",
  }).show();
}

// Clear Completed Tasks
function clearCompleteTasks() {
  // Filter out completed tasks
  const incompleteTasks = list.filter(t => !t.completed);

  if (list.length !== incompleteTasks.length) {
    // Update the list
    list = incompleteTasks;
    localStorage.setItem("tasks", JSON.stringify(list));

    // Refresh the task list
    showTasksList();

    // Show success notification
    Toastify({
      text: "Completed tasks have been removed",
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "left",
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
      stopOnFocus: true,
    }).showToast();
  } else {
    // Show notification if no completed tasks to remove
    Toastify({
      text: "There are no completed tasks to remove",
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "left",
      backgroundColor: "linear-gradient(to right, #e45757, #d44747)",
      stopOnFocus: true,
    }).showToast();
  }
}


// Show Edit Modal And Pass Data
function showEditModal(id) {
  const taskIndex = list.findIndex(t => t.id === id);
  const { text } = list[taskIndex];

  document.querySelector("#edit-modal .content #task-id").value = id;
  document.querySelector("#edit-modal .content #task-text").value = text.trim();
  
  // Remove previous event listener before adding a new one
  const updateButton = document.querySelector("#update-button");
  updateButton.replaceWith(updateButton.cloneNode(true));
  document.querySelector("#update-button").addEventListener("click", () => editTask(id));

  $("#edit-modal.modal").modal("show");
}

// Show Remove Modal
function showRemoveModal(id) {
  // Remove previous event listener before adding a new one
  const removeButton = document.querySelector("#remove-button");
  removeButton.replaceWith(removeButton.cloneNode(true));
  document.querySelector("#remove-button").addEventListener("click", () => removeTask(id));

  $("#remove-modal.modal").modal("show");
}

// Show Clear All Tasks Modal
function showClearAllTasksModal() {
  if (list.length > 0) {
    return $("#clear-all-tasks-modal.modal").modal("show");
  }

  new Noty({
    type: "error",
    text: '<i class="close icon"></i> There is no task to remove.',
    layout: "bottomRight",
    timeout: 2000,
    progressBar: true,
    closeWith: ["click"],
    theme: "metroui",
  }).show();
}

function showNotification(type, text) {
  new Noty({
    type,
    text: `<i class="check icon"></i> ${text}`,
    layout: "bottomRight",
    timeout: 2000,
    progressBar: true,
    closeWith: ["click"],
    theme: "metroui",
  }).show();
}

// Event Listeners
addTaskForm.addEventListener("submit", addTask);
window.addEventListener("load", () => addTaskInput.focus());

showTasksList();
