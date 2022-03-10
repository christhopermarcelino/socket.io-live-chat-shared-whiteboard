const socket = io('http://localhost:3001');

const createRoomForm = document.getElementById('create-room-form');
const creatorName = document.getElementById('username');
const creatorRoom = document.getElementById('room');
const isPublic = document.getElementById('isPublic-checkbox');
const isOpen = document.getElementById('isOpen-checkbox');

createRoomForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (creatorName.value === '' || creatorRoom.value === '') return;

  const data = {
    id: socket.id,
    username: creatorRoom.value,
    room: creatorRoom.value,
    isPublic: !isPublic.checked,
    isOpen: !isOpen.checked,
  };

  socket.emit('create-room', data);
});

socket.on('create-room', (data) => {
  console.log(data);
  const pResponse = document.createElement('p');

  pResponse.innerText = data.message;
  pResponse.classList.add('response-text');
  data.success
    ? pResponse.classList.add('bg-success')
    : pResponse.classList.add('bg-error');
  document.body.prepend(pResponse);

  if (data.success) {
    window.location.href = 'http://127.0.0.1:5500/client/chat.html';
  }
});
