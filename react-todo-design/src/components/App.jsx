import React from 'react'

const elTodoForm = document.querySelector("[data-todo-form]");
const elTodoItems = document.querySelector("[data-todo-items]");
const elTodoItemTemplate = document.querySelector("[data-todo-item-template]");

const todos = getTodos();
// const todo = {
//   title: "",
//   dueDate: new Date(),
//   createdAt: new Date(),
//   isDone: false
// }

renderTodos();

elTodoItems.addEventListener("click", (evt) => {
  if (!evt.target.matches("[data-delete]")) return;

  const todoId = evt.target.dataset.id;
  deleteTodo(todoId);
})

elTodoItems.addEventListener("change", (evt) => {
  const todoId = evt.target.dataset.id;

  toggleTodo(todoId);
})

elTodoForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const formData = new FormData(elTodoForm);

  const todo = {};
  todo.title = formData.get("title")
  todo.dueDate = new Date(formData.get("dueDate"))
  todo.createdAt = new Date(Date.now());
  todo.isDone = false;
  todo.id = todos.length + 1
  
  addTodo(todo);
})

function addTodo(todo) {
  todos.push(todo)

  renderTodos();
}

function deleteTodo(id) {
  const index = todos.findIndex(todo => todo.id === +id)

  todos.splice(index, 1);
  renderTodos()
}

function toggleTodo(id) {
  for (let i = 0; i < todos.length; i++) {
    if(+id === todos[i].id) {
      todos[i].isDone = !todos[i].isDone;
      break
    }
  }

  renderTodos();
}

function renderTodos() {
  elTodoItems.innerHTML = "";
  const todoItemsEls = [];

  todos.forEach(todo => {
    const elTodoItem = elTodoItemTemplate.content.cloneNode(true);

    elTodoItem.querySelector("[data-is-done]").checked = todo.isDone;
    elTodoItem.querySelector("[data-is-done]").id = `todo-${todo.id}`
    elTodoItem.querySelector("[data-title]").textContent = todo.title;
    elTodoItem.querySelector("[data-title]").setAttribute("for", `todo-${todo.id}`)
    const dueDate = new Date(todo.dueDate);
    const createdAt = new Date(todo.createdAt);
    elTodoItem.querySelector("[data-due-date]").textContent = `${dueDate.toLocaleDateString()} ${dueDate.toLocaleTimeString()}`;
    elTodoItem.querySelector("[data-created-at]").textContent = `${createdAt.toLocaleDateString()} ${createdAt.toLocaleTimeString()}`;

    elTodoItem.querySelectorAll("[data-id]").forEach(el => {
      el.dataset.id = todo.id
    })

    todoItemsEls.push(elTodoItem);
  })

  elTodoItems.append(...todoItemsEls);
  setTodos(todos);
}

function getTodos() {
  const stringTodos = localStorage.getItem("todos") || "[]"
  return JSON.parse(stringTodos);
}

function setTodos() {
  const stringTodos = JSON.stringify(todos);
  localStorage.setItem("todos", stringTodos)
}

export default function App() {
  return (
   <>
  <div className="container">
    <h1 className="text-center my-4">TODO</h1>

    <form data-todo-form>
      <div className="row">
        <div className="col-lg-5">
          <div className="my-2">
            <input required name="title" type="text" placeholder="Task name" className="form-control" />
          </div>
        </div>
        <div className="col-lg-5">
          <div className="my-2">
            <input required name="dueDate" type="datetime-local" placeholder="Task name" className="form-control" />
          </div>
        </div>
        <div className="col-lg-2">
          <div className="my-2">
            <button type="submit" className="btn btn-primary w-100">Add</button>
          </div>
        </div>
      </div>
    </form>

    <div className="list-group" data-todo-items>
      <p className="my-5 text-center">Empty</p>
    </div>
  </div>
  <template data-todo-item-template>
    <div className="list-group-item d-flex justify-content-between align-items-center">
      <div className="form-check todo-checkbox">
        <input data-is-done data-id className="form-check-input" type="checkbox" />
        <label data-title className="form-check-label me-2">
          
        </label>
        <span data-due-date className="badge bg-warning text-dark me-2"></span>
        <span data-created-at className="badge bg-secondary me-2"></span>
      </div>
      <button data-delete data-id type="button" className="btn btn-danger btn-sm">&#10005;</button>
    </div>
  </template>
   </>
  )
}
