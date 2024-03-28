const users = [];

const addUser = (connectionId, username, room) => {
  // Clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Validate the data
  if (!username || !room) {
    return {
      status: 'fail',
      error: 'Username and room are required!',
    };
  }

  // Check for existing user
  const existingUser = users.find((user) => user.username === username && user.room === room);

  // Validate username
  if (existingUser) {
    return {
      status: 'fail',
      error: 'Username is in use!',
    };
  }

  // Store user
  const user = { connectionId, username, room };
  users.push(user);

  return user;
};

const removeUser = (connectionId) => {
  const index = users.findIndex((user) => user.connectionId === connectionId);

  if (index > -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (connectionId) => {
  return users.find((user) => user.connectionId === connectionId);
};

const getUsersInRoom = (room) => {
  room = room.trim().toLowerCase();

  return users.filter((user) => user.room === room);
};

module.exports = { addUser, getUser, getUsersInRoom, removeUser };
