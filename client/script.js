const socket = io('http://localhost:3001');

const createRoomForm = document.getElementById('create-room-form');
const username = document.getElementById('username');
const room = document.getElementById('room');
const isPublic = document.getElementById('isPublic');
const isOpen = document.getElementById('isOpen');

const joinRoomForm = document.getElementById('join-room-form');

const checkBoxInput = document.querySelectorAll('.checkbox-input');

checkBoxInput &&
  checkBoxInput.forEach((checkBox) => {
    checkBox.addEventListener('change', function (e) {
      e.target.nextElementSibling.nextElementSibling.classList.toggle(
        'translate-x-full'
      );
    });
  });

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
  createRoomForm.prepend(pResponse);

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
    window.location.href = 'http://localhost:3001/';
  }
});
