module.exports = {
    getTodoList: () => {
        let storedTodos = localStorage.getItem('todos')
        return JSON.parse(storedTodos)
    },
    addTodo: (todo) => {
        if (localStorage.getItem('todos') === null) {
            localStorage.setItem('todos', JSON.stringify([todo]))
        } else {
            let storedTodos = localStorage.getItem('todos')
            let parsedTodos = JSON.parse(storedTodos)
            parsedTodos.unshift(todo)
            localStorage.setItem('todos', JSON.stringify(parsedTodos))
        }
    },
    updateTodo: (index, todo) => {
        let storedTodos = localStorage.getItem('todos')
        let parsedTodos = JSON.parse(storedTodos)
        parsedTodos.splice(index, 1, todo)
        localStorage.setItem('todos', JSON.stringify(parsedTodos))
    },
    deleteTodo: (index) => {
        let storedTodos = localStorage.getItem('todos')
        let parsedTodos = JSON.parse(storedTodos)
        parsedTodos.splice(index, 1)
        localStorage.setItem('todos', JSON.stringify(parsedTodos))
    }
}