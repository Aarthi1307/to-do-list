const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const progressBar = document.getElementById("progressBar");
const themeSwitch = document.getElementById("themeSwitcher");

// Restore theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeSwitch.checked = true;
}
themeSwitch.onchange = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
};

// Load tasks
window.addEventListener("load", () => {
  JSON.parse(localStorage.getItem("tasks") || "[]").forEach(t => addTaskToDOM(t.text, t.done, false));
  updateProgress();
});

// Add task
addBtn.onclick = () => {
  const text = taskInput.value.trim();
  if (!text) return;
  addTaskToDOM(text, false, true);
  taskInput.value = "";
  saveTasks();
  updateProgress();
};

function addTaskToDOM(text, done, animate) {
  const li = document.createElement("li");
  if (!animate) li.style.animation = "none";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = done;

  const span = document.createElement("span");
  span.textContent = text;
  if (done) span.classList.add("completed");

  checkbox.onchange = () => {
    span.classList.toggle("completed");
    saveTasks();
    updateProgress();
  };

  const del = document.createElement("i");
  del.className = "fas fa-trash delete";
  del.onclick = () => {
    li.style.animation = "slideOut 0.4s forwards";
    setTimeout(() => {
      li.remove();
      saveTasks();
      updateProgress();
    }, 400);
  };

  li.append(checkbox, span, del);
  taskList.appendChild(li);
}

function saveTasks() {
  const tasks = [...taskList.children].map(li => {
    return {
      text: li.querySelector("span").textContent,
      done: li.querySelector("input").checked
    };
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateProgress() {
  const total = taskList.children.length;
  const done = [...taskList.querySelectorAll("input:checked")].length;
  progressBar.style.width = total ? `${(done / total) * 100}%` : "0%";
}

  