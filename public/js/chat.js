const socket = io();

socket.on('message', (message) => {
  console.log(message);
});

document.querySelector('#message-form').addEventListener('submit', (e) => {
  e.preventDefault();

  let message = e.target.elements.message.value;

  socket.emit('sendMessage', message);
  message = '';
});

document.querySelector('#send-location').addEventListener('click', () => {
  if (!navigator.geolocation) return alert('Geolocation is not supported by your browser.');

  navigator.geolocation.getCurrentPosition(showPosition, showError);
});

const showPosition = (position) => {
  const location = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };

  socket.emit('sendLocation', location);
};

const showError = (error) => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.log('User denied the request for Geolocation.');
      break;
    case error.POSITION_UNAVAILABLE:
      console.log('Location information is unavailable.');
      break;
    case error.TIMEOUT:
      console.log('The request to get user location timed out.');
      break;
  }
};
