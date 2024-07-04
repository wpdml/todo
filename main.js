let taskInput = document.getElementById("task-input");
let addButton = document.getElementById("add-button");
let tabs = document.querySelectorAll(".task-tabs div");
let underLine = document.getElementById("under-line");
let taskList = [];
let mode = "all";
let filterList = [];

addButton.addEventListener("click", addTask);
taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

tabs.forEach(tab => {
  tab.addEventListener("click", function (event) {
    filter(event);
    moveUnderLine(event);
  });
});

function addTask() {
  if (taskInput.value.trim() === "") {
    return;
  }
  let task = {
    id: randomIDGenerate(),
    taskContent: taskInput.value,
    isComplete: false,
  };
  taskList.push(task);
  taskInput.value = "";
  render();
}

function render() {
  let list = (mode === "all") ? taskList : filterList;

  let resultHTML = "";
  list.forEach(task => {
    resultHTML += `
      <div class="task">
        <div ${task.isComplete ? 'class="task-done"' : ''}>${task.taskContent}</div>
        <div>
          <i class="fas fa-check-circle ${task.isComplete ? 'completed' : ''}" onclick="toggleComplete('${task.id}')"></i>
          <i class="fas fa-times-circle" onclick="deleteTask('${task.id}')"></i>
        </div>
      </div>`;
  });
  document.getElementById("task-board").innerHTML = resultHTML;
}

function toggleComplete(id) {
  let task = taskList.find(task => task.id === id);
  if (task) {
    task.isComplete = !task.isComplete;
    filter({ target: { id: mode } });
    moveUnderLine({ currentTarget: document.getElementById(mode) });
  }
}

function deleteTask(id) {
  taskList = taskList.filter(task => task.id !== id);
  filter({ target: { id: mode } });
  moveUnderLine({ currentTarget: document.getElementById(mode) });
}

function filter(event) {
  mode = event.target.id;
  if (mode === "all") {
    render();
  } else {
    filterList = taskList.filter(task => (mode === "ongoing" && !task.isComplete) || (mode === "done" && task.isComplete));
    render();
  }
  updateActiveTab(event.target);
  moveUnderLine(event);
}

function randomIDGenerate() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

function moveUnderLine(event) {
  underLine.style.left = event.currentTarget.offsetLeft + "px";
  underLine.style.width = event.currentTarget.offsetWidth + "px";
}

function updateActiveTab(selectedTab) {
  tabs.forEach(tab => {
    tab.classList.remove("active");
  });
  selectedTab.classList.add("active");
}

document.addEventListener("DOMContentLoaded", function() {
  updateActiveTab(document.getElementById("all"));
  moveUnderLine({ currentTarget: document.getElementById("all") });
  render();
});
