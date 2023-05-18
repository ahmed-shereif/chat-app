const moment = require("moment");

function formatMessage(user, text, userId) {
  return {
    user,
    text,
    time: moment().format("h:mm a"),
    id: userId,
  };
}

module.exports = formatMessage;
