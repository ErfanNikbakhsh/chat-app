const generateMessage = (message) => {
  return {
    text: message,
    createdAt: Date.now(),
  };
};

const generateLocationMessage = (url) => {
  return {
    url,
    createdAt: Date.now(),
  };
};

module.exports = { generateMessage, generateLocationMessage };
