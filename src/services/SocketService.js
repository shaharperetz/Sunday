import io from 'socket.io-client';

const BASE_URL =
  process.env.NODE_ENV === 'production' ? '/' : '//localhost:3030';

let socket;

export default {
  setup,
  terminate,
  on,
  off,
  emit
};

function setup() {
  console.log('setup');

  if (!socket) socket = io(BASE_URL);
}

function terminate() {
  console.log('terminate');
  socket = null;
}

function on(eventName, cb) {
  socket.on(eventName, cb);
}

function off(eventName, cb) {
  console.log('off with - eventName', eventName)
  if (socket) socket.off(eventName, cb);
}

function emit(eventName, data) {
  console.log('eventName', eventName)
  socket.emit(eventName, data);
}
