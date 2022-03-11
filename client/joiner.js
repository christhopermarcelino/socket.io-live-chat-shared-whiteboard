const socket = io('http://localhost:3001');

const mainJoin = document.getElementById('main-join');
const mainRoom = document.getElementById('main-room');

const joinRoomForm = document.getElementById('join-room-form');
const username = document.getElementById('username');
const room = document.getElementById('room');

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
  const pResponse = document.createElement('span');

  pResponse.innerText = data.message;
  pResponse.classList.add(
    'text-white',
    'font-semibold',
    'rounded-md',
    'px-4',
    'py-1',
    'bg-red-500'
  );

  !data.success && pResponse.classList.add('bg-red-500');
  joinRoomForm.prepend(pResponse);

  if (data.success) {
    mainJoin.classList.add('hidden');
    mainRoom.classList.remove('hidden');
  }
});
