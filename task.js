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
      const taskId = `task-${task.id}`; // Unique ID for each task
  
      const element = `
        <li class="ui segment grid equal width">
          <div class="column">
            <div class="ui checkbox">
              <input id="${taskId}" type="checkbox" ${task.completed ? "checked" : ""} data-id="${task.id}">
              <label for="${taskId}">${task.text}</label>
            </div>
          </div>
          <div class="column">
            <i data-id="${task.id}" class="edit outline icon"></i>
            <i data-id="${task.id}" class="trash alternate outline remove icon"></i>
          </div>
        </li>
      `;
  
      tasksList.insertAdjacentHTML("beforeend", element);
    });
  
    // Attach event listeners after rendering the tasks
    attachEventListeners();
  }
  
  function attachEventListeners() {
    // Event listeners for checkbox toggling
    document.querySelectorAll('li input[type="checkbox"]').forEach(item => {
      item.addEventListener("change", e => {
        completeTask(+e.target.dataset.id);
      });
    });
  
    // Event listeners for editing tasks
    document.querySelectorAll('li i.edit').forEach(item => {
      item.addEventListener("click", e => {
        e.stopPropagation();
        showEditModal(+e.target.dataset.id);
      });
    });
  
    // Event listeners for removing tasks
    document.querySelectorAll('li i.trash').forEach(item => {
      item.addEventListener("click", e => {
        e.stopPropagation();
        showRemoveModal(+e.target.dataset.id);
      });
    });
  }
  
  function completeTask(taskId) {
    const list = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedList = list.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    localStorage.setItem("tasks", JSON.stringify(updatedList));
    showTasksList();
  }
  