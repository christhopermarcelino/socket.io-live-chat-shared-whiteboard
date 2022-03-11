const socket = io('http://localhost:3001');

const createRoomForm = document.getElementById('create-room-form');
const username = document.getElementById('username');
const room = document.getElementById('room');
const isPublic = document.getElementById('isPublic-checkbox');
const isOpen = document.getElementById('isOpen-checkbox');

const joinRoomForm = document.getElementById('join-room-form');

createRoomForm &&
  createRoomForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (username.value === '' || room.value === '') return;

    const data = {
      id: socket.id,
      username: username.value,
      room: room.value,
      isPublic: !isPublic.checked,
      isOpen: !isOpen.checked,
    };

    socket.emit('create-room', data);
  });

socket.on('create-room', (data) => {
  const pResponse = document.createElement('p');

  pResponse.innerText = data.message;
  pResponse.classList.add('response-text');
  data.success
    ? pResponse.classList.add('bg-success')
    : pResponse.classList.add('bg-error');
  document.body.prepend(pResponse);

  if (data.success) {
    window.location.href = 'http://localhost:3001/room';
  }
});

joinRoomForm &&
  joinRoomForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (username.value === '' || room.value === '') return;

    const data = {
      username: username.value,
      room: room.value,
    };

    socket.emit('join-room', data);
  });

socket.on('join-room', (data) => {
  console.log(data);
  const pResponse = document.createElement('p');

  pResponse.innerText = data.message;
  pResponse.classList.add('response-text');
  data.success
    ? pResponse.classList.add('bg-success')
    : pResponse.classList.add('bg-error');
  document.body.prepend(pResponse);

  if (data.success) {
    window.location.href = 'http://127.0.0.1:5500/room';
  }
});
