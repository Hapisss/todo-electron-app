window.addEventListener('DOMContentLoaded', () => {
    const { getTodoList, addTodo, updateTodo, deleteTodo } = require('./service/service')

    const greetingElement = document.getElementById('greeting')
    const todoListElement = document.getElementById('todo-list')
    const addButton = document.getElementById('add-button')

    const modalContainer = document.getElementById('modal-container')
    const editInputEl = document.getElementById('edit-input-todo')
    const doneEditButton = document.getElementById('edit-button')
    const cancelEditButton = document.getElementById('cancel-edit-button')

    const prepareGreeting = () => {
        let objDate = new Date()
        let hour = objDate.getHours()
        if (hour < 12 || hour > 6) {
            greetingElement.innerText = 'Good Morning!'
        } else if (hour > 12 || hour < 6) {
            greetingElement.innerText = 'Good Evening!'
        }
    }

    const prepareUI = (data) => {
        todoListElement.innerHTML = ''
        data.forEach(item => {
            let todoRow = document.createElement('div')
            let inputEl = document.createElement('input')
            let labelEl = document.createElement('label')
            let actionEl = document.createElement('div')
            let editIcon = document.createElement('img')
            let deleteIcon = document.createElement('img')

            // ACTION BUTTON
            deleteIcon.setAttribute('src', './assets/icon/delete-icon.svg')
            deleteIcon.setAttribute('title', 'Delete Todo')
            deleteIcon.style.cursor = 'pointer'
            deleteIcon.onclick = () => doDeleteTodo(item.id)

            editIcon.setAttribute('src', './assets/icon/edit-icon.svg')
            editIcon.setAttribute('title', 'Edit Todo')
            editIcon.style.cursor = 'pointer'
            editIcon.onclick = () => prepareEdit(item.id)

            actionEl.appendChild(editIcon)
            actionEl.appendChild(deleteIcon)
            actionEl.setAttribute('class', 'todo-action')

            // CHECKBOX
            inputEl.setAttribute('type', 'checkbox')
            inputEl.setAttribute('name', item.id)
            inputEl.setAttribute('id', item.id)
            inputEl.setAttribute('class', 'todo-checkbox')

            if (item.completed) {
                inputEl.setAttribute('checked', true)
            }
            inputEl.onclick = () => doCompleteTodo(item.id)


            // LABEL
            labelEl.setAttribute('for', item.id)
            labelEl.setAttribute('class', 'todo-label')
            labelEl.innerText = item.title

            // INSERT INTO DIV
            todoRow.appendChild(inputEl)
            todoRow.appendChild(labelEl)
            todoRow.appendChild(actionEl)

            todoRow.addEventListener('mouseenter', () => {
                actionEl.style.visibility = 'visible'
            })

            todoRow.addEventListener('mouseleave', () => {
                actionEl.style.visibility = 'hidden'
            })

            todoRow.setAttribute('class', 'todo-row')

            // INSERT INTO LIST
            todoListElement.appendChild(todoRow)

        });
    }

    const prepareEdit = (id) => {
        modalContainer.style.visibility = 'visible'
        let { selectedItem } = doGetItemById(id)
        editInputEl.value = selectedItem.title
        doneEditButton.onclick = () => doUpdateTodo(id)
        cancelEditButton.onclick = () => modalContainer.style.visibility = 'hidden'
    }

    const doGetTodoList = async () => {
        const data = getTodoList()
        prepareUI(data)
    }

    const doAddTodo = () => {
        let inputValue = document.getElementById('input-todo').value
        if (inputValue !== '' || inputValue !== null) {
            addTodo({ id: Date.now(), title: inputValue, completed: false })
        }
        doGetTodoList()

        document.getElementById('input-todo').value = ''
    }
    addButton.onclick = () => doAddTodo()

    const doGetItemById = (id) => {
        let storedTodos = localStorage.getItem('todos')
        let parsedTodos = JSON.parse(storedTodos)
        let selectedItem = {}
        let selectedItemIndex = 0

        for (let i = 0; i < parsedTodos.length; i++) {
            if (id === parsedTodos[i].id) {
                selectedItem = parsedTodos[i]
                selectedItemIndex = i
            }
        }

        return {
            selectedItem,
            selectedItemIndex
        }
    }

    const doCompleteTodo = (id) => {
        let { selectedItem, selectedItemIndex } = doGetItemById(id)

        let updatedTodo = {
            id: selectedItem.id,
            completed: !selectedItem.completed,
            title: selectedItem.title
        }

        updateTodo(selectedItemIndex, updatedTodo)
        doGetTodoList()
    }

    const doUpdateTodo = (id) => {
        let { selectedItem, selectedItemIndex } = doGetItemById(id)

        let updatedTodo = {
            id: selectedItem.id,
            completed: selectedItem.completed,
            title: editInputEl.value
        }

        updateTodo(selectedItemIndex, updatedTodo)
        modalContainer.style.visibility = 'hidden'
        doGetTodoList()
    }

    const doDeleteTodo = (id) => {
        let { selectedItemIndex } = doGetItemById(id)
        deleteTodo(selectedItemIndex)
        doGetTodoList()
    }

    prepareGreeting()
    doGetTodoList()
})