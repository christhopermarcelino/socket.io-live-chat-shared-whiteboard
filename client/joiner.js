const socket = io('http://localhost:3001');

const mainJoin = document.getElementById('main-join');
const mainRoom = document.getElementById('main-room');

const joinRoomForm = document.getElementById('join-room-form');
let username = document.getElementById('username');
let room = document.getElementById('room');
let isRoomPublic = null;
let isRoomOpened = null;

const chatRoom = document.getElementById('chat-room');
const messageForm = document.getElementById('message-form');
let message = document.getElementById('message');

const identityBadge = document.getElementById('identity-badge');
let logRoom = document.getElementById('log-room');
const logOutButton = document.getElementById('logout-button');

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

  !data.success && joinRoomForm.prepend(pResponse);

  if (data.success) {
    mainJoin.classList.add('hidden');
    mainRoom.classList.add('flex');
    mainRoom.classList.remove('hidden');
    document.title = 'Live chat & whiteboard app';
    identityBadge.innerHTML = `Hi, ${username.value}! You are in room ${room.value}`;
  }

  isRoomPublic = data.data.isPublic;
  isRoomOpened = data.data.isOpen;

  console.log(data, isRoomPublic, isRoomOpened);
});

socket.on('interact-room', (data) => {
  // data: time, message, room
  logRoom.innerHTML = '';
  data.forEach((d) => {
    const p = document.createElement('p');
    p.appendChild(document.createTextNode(`${d.time}: ${d.message}`));
    logRoom.append(p);
  });
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
    chatRoom.append(appendMessage(m));
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

logOutButton.addEventListener('click', (e) => {
  if (confirm('Are you sure you want to log out?')) {
    socket.emit('force-disconnect');
  }
});

socket.on('disconnect', (reason) => {
  username.value =
    room.value =
    message.value =
    isRoomPublic =
    isRoomRestricted =
      '';
  mainJoin.classList.remove('hidden');
  mainRoom.classList.remove('flex');
  mainRoom.classList.add('hidden');
  document.title = 'Join a room';
  identityBadge.innerHTML = '';
  logRoom.innerHTML = '';
  chatRoom.innerHTML = '';

  joinRoomForm.getElementsByTagName('span').forEach((tag) => tag.remove());
});

('use strict');

(function () {
  function getMousePoint(ex, ey) {
    var px = 0,
      py = 0;
    var el = document.getElementById('canvas');
    while (el) {
      px += el.offsetLeft;
      py += el.offsetTop;
      el = el.offsetParent;
    }

    return { x: ex - px, y: ey - py };
  }

  var canvas = document.getElementById('canvas');
  var colors = document.getElementsByClassName('color');
  var context = canvas.getContext('2d');

  var current = {
    color: 'black',
  };
  var drawing = false;

  canvas.addEventListener('mousedown', onMouseDown, false);
  canvas.addEventListener('mouseup', onMouseUp, false);
  canvas.addEventListener('mouseout', onMouseUp, false);
  canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

  //Touch support for mobile devices
  canvas.addEventListener('touchstart', onMouseDown, false);
  canvas.addEventListener('touchend', onMouseUp, false);
  canvas.addEventListener('touchcancel', onMouseUp, false);
  canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);

  for (var i = 0; i < colors.length; i++) {
    colors[i].addEventListener('click', onColorUpdate, false);
  }

  socket.on('drawing', onDrawingEvent);

  window.addEventListener('resize', onResize, false);
  onResize();

  function drawLine(x0, y0, x1, y1, color, emit) {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.stroke();
    context.closePath();

    if (!emit) {
      return;
    }
    var w = canvas.width;
    var h = canvas.height;

    socket.emit(
      'drawing',
      {
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h,
        color: color,
      },
      room.value
    );
  }

  function onMouseDown(e) {
    if (isRoomOpened) drawing = true;
    current.x = e.clientX || e.touches[0].clientX;
    current.y = e.clientY || e.touches[0].clientY;
  }

  function onMouseUp(e) {
    if (!drawing) {
      return;
    }
    drawing = false;
    drawLine(
      current.x,
      current.y,
      e.clientX || e.touches[0].clientX,
      e.clientY || e.touches[0].clientY,
      current.color,
      true
    );
  }

  function onMouseMove(e) {
    if (!drawing) {
      return;
    }
    drawLine(
      current.x,
      current.y,
      e.clientX || e.touches[0].clientX,
      e.clientY || e.touches[0].clientY,
      current.color,
      true
    );
    current.x = e.clientX || e.touches[0].clientX;
    current.y = e.clientY || e.touches[0].clientY;
  }

  function onColorUpdate(e) {
    current.color = e.target.className.split(' ')[1];
  }

  // limit the number of events per second
  function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function () {
      var time = new Date().getTime();

      if (time - previousCall >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }

  function onDrawingEvent(data) {
    var w = canvas.width;
    var h = canvas.height;
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
  }

  // make the canvas fill its parent
  function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
})();
