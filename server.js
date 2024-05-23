const express = require('express');
const http = require('http');
const socket = require('socket.io');
const path = require('path');
const formatMsg = require('./public/utils/format');
const { joinChat, getCurrentUser, leave, roomUsers } = require('./public/utils/users');

const app = express();
const server = http.createServer(app);
const io = socket(server);
const botName = 'ChatBot'

app.use(express.static(path.join(__dirname, 'public'))); // - static folder set

io.on('connection', (socket) => { // when client connects
    console.log("New ws connection...");

    socket.on('chat-room', ({ username, room }) => {
        const user = joinChat(socket.id, username, room);
        socket.join(user.room);
        socket.to(user.room).emit('message', formatMsg(botName, "welcome to chat")); // send whenever someone connect single time.
        // io.emit() - broadcast to every client
        socket.broadcast.emit('message', formatMsg(botName, `${user.username} has connected`));  // broadcast when user connects but not to the one who connects

        //room and users info
        io.to(user.room).emit('roomUsers', ({ room: user.room, users: roomUsers(user.room) }));

    })

    // msg in room
    socket.on('chat message', (msg) => {
        const user = getCurrentUser(socket.id);
        console.log(user)
        if (user) {
            io.to(user.room).emit('message', formatMsg(user.username, msg));
        }
    })

    // when disconnects
    socket.on('disconnect', () => {
        const user = leave(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMsg(botName, `${user.username} has left the chat!`));
            console.log('Disconected');
            io.to(user.room).emit('roomUser', ({ room: user.room, users: roomUsers(user.room) }));
        }

    })
})



server.listen(3000, () => {
    console.log('listening to port 3000');
})