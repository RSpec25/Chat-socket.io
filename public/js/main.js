const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true }); // get username roon from URL

const socket = io();

// join chatroom
socket.emit('chat-room', ({ username, room }));

//room and user info..
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})
// message from server.....
socket.on('message', msg => {
    outPutMsg(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('msg').value;
    //const msg = e.target.element.msg.value; // document.getElementById('msg')
    // console.log("enteered:", msg.value, e.target.elements.msg.value);
    // emiting a msg to chat 
    socket.emit('chat message', msg);
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus()
})

function outPutMsg(msg) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class = "meta" > ${msg.username} <span> ${msg.time}</span></p>
                    <p class ="text" > ${msg.message} </p>`;

    document.querySelector('.chat-messages').appendChild(div);
}
// room name to dom
function outputRoomName(room) {
    document.getElementById('room-name').innerText = room;
}

//add users to dom...
function outputUsers(users) {
    document.getElementById('users').innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`
    // const userList = document.getElementById('users').innerHTML;
    // users.forEach(user => {const li = document.createElement('li'); li.innerText = user.username; userList.appendChild(li) })
}