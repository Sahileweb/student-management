const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

module.exports = (email) => {
  return gmailRegex.test(email);
};
