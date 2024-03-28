const generateMessage = (username, message) => {
  return {
    username,
    text: message,
    createdAt: Date.now(),
  };
};

const generateLocationMessage = (username, url) => {
  return {
    username,
    url,
    createdAt: Date.now(),
  };
};

module.exports = { generateMessage, generateLocationMessage };
