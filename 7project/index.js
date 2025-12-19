const API_BASE_URL = "https://dummyjson.com/todos";
const todoListEl = document.getElementById("todoList");
const paginationEl = document.getElementById("pagination");
const loaderEl = document.getElementById("loader");
const errorEl = document.getElementById("error");
const searchInput = document.getElementById("searchInput");
const filterBtn = document.getElementById("filterBtn");
const fromDateInput = document.getElementById("fromDate");
const toDateInput = document.getElementById("toDate");
const newTodoInput = document.getElementById("newTodoInput");
const addTodoBtn = document.getElementById("addTodoBtn");

let todos = [];
let filteredTodos = [];
let currentPage = 1;
const todosPerPage = 10;

// Helper: Show Loader
function showLoader(show = true) {
  loaderEl.classList.toggle("d-none", !show);
}

// Helper: Show Error
function showError(message = "") {
  if (message) {
    errorEl.textContent = message;
    errorEl.classList.remove("d-none");
  } else {
    errorEl.classList.add("d-none");
  }
}

// Fetch Todos from API
async function fetchTodos() {
  showLoader(true);
  showError();

  try {
    const res = await fetch(`${API_BASE_URL}?limit=100`);
    const data = await res.json();
    todos = data.todos.map(todo => ({
      ...todo,
      createdAt: randomDate(new Date(2023, 0, 1), new Date()) // Add fake date
    }));
    filteredTodos = [...todos];
    renderTodos();
  } catch (err) {
    showError("Failed to fetch todos. Try again later.");
  }

  showLoader(false);
}

// Add Todo (POST)
async function addTodo() {
  const todoText = newTodoInput.value.trim();
  if (!todoText) return alert("Please enter a todo.");

  showLoader(true);
  showError();

  try {
    const res = await fetch(`${API_BASE_URL}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        todo: todoText,
        completed: false,
        userId: 1
      })
    });

    const newTodo = await res.json();
    newTodo.createdAt = new Date(); // Add simulated date

    todos.unshift(newTodo); // Add to top
    filteredTodos = [...todos];
    newTodoInput.value = "";
    currentPage = 1;
    renderTodos();
  } catch (err) {
    showError("Failed to add todo. Try again later.");
  }

  showLoader(false);
}

// Render Todos (Paginated)
function renderTodos() {
  const start = (currentPage - 1) * todosPerPage;
  const end = start + todosPerPage;
  const todosToShow = filteredTodos.slice(start, end);

  todoListEl.innerHTML = "";
  if (todosToShow.length === 0) {
    todoListEl.innerHTML = `<div class="alert alert-info">No todos found.</div>`;
    paginationEl.innerHTML = "";
    return;
  }

  todosToShow.forEach(todo => {
    const item = document.createElement("div");
    item.className = `list-group-item d-flex justify-content-between align-items-center ${
      todo.completed ? "list-group-item-success" : ""
    }`;
    item.innerHTML = `
      <span>
        ${todo.todo}
        <small class="text-muted ms-2">(${formatDate(todo.createdAt)})</small>
      </span>
      <span class="badge bg-${todo.completed ? "success" : "secondary"}">${todo.completed ? "Done" : "Pending"}</span>
    `;
    todoListEl.appendChild(item);
  });

  renderPagination();
}

// Render Pagination Buttons
function renderPagination() {
  const totalPages = Math.ceil(filteredTodos.length / todosPerPage);
  paginationEl.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("li");
    btn.className = `page-item ${i === currentPage ? "active" : ""}`;
    btn.innerHTML = `<button class="page-link">${i}</button>`;
    btn.addEventListener("click", () => {
      currentPage = i;
      renderTodos();
    });
    paginationEl.appendChild(btn);
  }
}

// Search Todos (local)
function searchTodos() {
  const searchTerm = searchInput.value.toLowerCase();
  filteredTodos = todos.filter(todo =>
    todo.todo.toLowerCase().includes(searchTerm)
  );
  currentPage = 1;
  renderTodos();
}

// Filter by Date Range
function filterByDateRange() {
  const from = fromDateInput.value ? new Date(fromDateInput.value) : null;
  const to = toDateInput.value ? new Date(toDateInput.value) : null;

  filteredTodos = todos.filter(todo => {
    const createdAt = new Date(todo.createdAt);
    return (!from || createdAt >= from) && (!to || createdAt <= to);
  });

  currentPage = 1;
  renderTodos();
}

// Simulate Random Date (for dummy todos)
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Format Date
function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

// Event Listeners
searchInput.addEventListener("input", searchTodos);
filterBtn.addEventListener("click", filterByDateRange);
addTodoBtn.addEventListener("click", addTodo);

// Initial Load
fetchTodos();