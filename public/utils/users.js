const users = [];

// Join user to chat
function joinChat(id, username, room) {
    const user = { id, username, room };
    users.push(user);
    return user;
}

//function get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

//function to remove user

function leave(id) {
    const index = users.findIndex(user => user.id === id);
    const user = users.find(user => user.id === id);
    if (index !== -1) {
        users.splice(index, 1);
    }
    return user;
}
//fucntin to get
function roomUsers(room) {
    return users.filter(user => user.room === room);
}
module.exports = { joinChat, getCurrentUser, roomUsers, leave };