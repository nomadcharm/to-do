(function () {

  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  };

  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    button.disabled = true;
    input.addEventListener('input', function () {
      if (input.value === '') {
        button.disabled = true;
      } else {
        button.disabled = false;
      }
    });

    return {
      form,
      input,
      button,
    };
  };

  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  };

  todoArray = [];

  function createTodoItem(name, done = false) {

    let item = document.createElement('li');

    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = name;
    item.done = done;
    item.id = Math.floor(Math.random() * 1e5);

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton,
      buttonGroup,
    };
  };

  function storedObjStatus(arr, item) {
    for (let i = 0; i < arr.length; ++i) {
      if (arr[i].id === item.id && arr[i].done === false) {
        arr[i].done = true;
      } else if (arr[i].id === item.id && arr[i].done === true) {
        arr[i].done = false;
      };
    };
  };

  function changeStatus(item, button) {
    button.addEventListener('click', function () {
      todoArray = JSON.parse(localStorage.getItem(listName));
      storedObjStatus(todoArray, item);
      item.classList.toggle('list-group-item-success');
      localStorage.setItem(listName, JSON.stringify(todoArray));
    });
  };

  function deleteStoredObj(arr, property, value) {
    for (let i = 0; i < arr.length; ++i) {
      if (arr[i][property] === value) {
        arr.splice(i, 1);
        break;
      };
    };
  };

  function deleteItem(item, button) {
    button.addEventListener('click', function () {
      if (confirm('Вы уверены?')) {
        todoArray = JSON.parse(localStorage.getItem(listName));
        deleteStoredObj(todoArray, 'id', item.id);
        item.remove();
        localStorage.setItem(listName, JSON.stringify(todoArray));
      };
    });
  };

  function createTodoApp(container, title = 'Список дел', listName) {

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    if (localStorage.getItem(listName) === null) {
      todoArray = [];
    } else {
      todoArray = JSON.parse(localStorage.getItem(listName));

      for (let obj of todoArray) {
        let todoItem = createTodoItem(todoItemForm.input.value);
        todoItem.item.textContent = obj.name;
        todoItem.item.id = obj.id;

        if (obj.done === true) {
          todoItem.item.classList.add('list-group-item-success');
        };

        todoList.append(todoItem.item);
        todoItem.item.append(todoItem.buttonGroup);
        todoItem.buttonGroup.append(todoItem.doneButton, todoItem.deleteButton);

        changeStatus(todoItem.item, todoItem.doneButton);
        deleteItem(todoItem.item, todoItem.deleteButton);
      };
    };

    todoItemForm.form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!todoItemForm.input.value) {
        return;
      };

      let todoItem = createTodoItem(todoItemForm.input.value);

      function createArrayObj(arr) {
        let storedObj = {
          id: todoItem.item.id,
          name: todoItemForm.input.value,
          done: todoItem.item.done,
        };
        arr.push(storedObj);
      };
      createArrayObj(todoArray);
      localStorage.setItem(listName, JSON.stringify(todoArray));

      changeStatus(todoItem.item, todoItem.doneButton);
      deleteItem(todoItem.item, todoItem.deleteButton);

      todoList.append(todoItem.item);
      todoItemForm.input.value = '';
      todoItemForm.button.disabled = true;
    });
  };

  window.createTodoApp = createTodoApp;
})();
