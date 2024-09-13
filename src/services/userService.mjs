const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com', age: 25 }
]

const getUsers = () => users

const getUserById = (id) => users.find(user => user.id === parseInt(id))

export { getUsers, getUserById }