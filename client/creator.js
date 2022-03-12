const socket = io('http://localhost:3001');

const mainCreate = document.getElementById('main-create');
const mainRoom = document.getElementById('main-room');

const createRoomForm = document.getElementById('create-room-form');
const username = document.getElementById('username');
const room = document.getElementById('room');
const isPublic = document.getElementById('isPublic');
const isOpen = document.getElementById('isOpen');
const checkBoxInput = document.querySelectorAll('.checkbox-input');

const chatRoom = document.getElementById('chat-room');
const messageForm = document.getElementById('message-form');
const message = document.getElementById('message');

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
    mainCreate.classList.add('hidden');
    mainRoom.classList.remove('hidden');
  }
});

messageForm &&
  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (message.value === '') return;

    const messageData = {
      message: message.value,
      author: username.value,
      room: room.value,
      time: `${new Date().getHours()}:${new Date().getMinutes()}`,
    };

    socket.emit('send-message', messageData);
  });

socket.on('send-message', (data) => {
  // data = {message, author, time, room}
  chatRoom.innerHTML = '';
  data.messageList.forEach((m) => {
    chatRoom.appendChild(appendMessage(m));
  });
});

const appendMessage = (m) => {
  const div1 = document.createElement('div');
  const span1 = document.createElement('span');
  const div2 = document.createElement('div');
  const span2 = document.createElement('span');
  const div3 = document.createElement('div');
  const span3 = document.createElement('span');

  if (m.author === username.value) {
    div1.classList.add('flex', 'flex-col', 'items-end');
    span1.classList.add('text-sm', 'font-semibold');
    div2.classList.add(
      'flex',
      'items-end',
      'space-x-2',
      'justify-end',
      'w-full'
    );
    span2.classList.add('text-sm', 'font-semibold');
    div3.classList.add(
      'bg-green-400',
      'px-3',
      'py-1',
      'rounded-tl-xl',
      'rounded-br-xl',
      'rounded-bl-xl',
      'text-white',
      'text-md',
      'font-normal',
      'max-w-[60%]',
      'font-semibold'
    );

    span1.appendChild(document.createTextNode(m.author));
    span2.appendChild(document.createTextNode(m.time));
    span3.appendChild(document.createTextNode(m.message));

    div1.appendChild(span1);
    div1.appendChild(div2);
    div2.appendChild(span2);
    div2.appendChild(div3);
    div3.appendChild(span3);
  } else {
    span1.classList.add('text-sm', 'font-semibold');
    div2.classList.add('flex', 'items-end', 'space-x-2');
    div3.classList.add(
      'bg-gray-400',
      'px-3',
      'py-1',
      'rounded-tr-xl',
      'rounded-br-xl',
      'rounded-bl-xl',
      'text-white',
      'text-md',
      'font-normal',
      'max-w-[60%]',
      'font-semibold'
    );
    span3.classList.add('text-sm', 'font-semibold');

    span1.appendChild(document.createTextNode(m.author));
    span2.appendChild(document.createTextNode(m.message));
    span3.appendChild(document.createTextNode(m.time));

    div1.appendChild(span1);
    div1.appendChild(div2);
    div2.appendChild(div3);
    div3.appendChild(span2);
    div2.appendChild(span3);
  }

  return div1;
};
